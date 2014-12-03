[#ftl]
[#--
 * File: user.ftl
 * Action: com.xybase.app.action.UserActionBean
 *
 * @author imam
--]
[#include "/WEB-INF/ftl/layout.ftl"]
[@layout title="jQuery XYTable Implementation"]
<!-- Box Grid 1 -->
<div class="box" id="gridOneBox">

    <!-- Box Grid 1 Head -->
    <div class="box-head">
        <h2 class="left">Grid One with Pagination</h2>
    </div>
    <!-- End Box Grid 1 Head -->

    <!-- Grid 1 -->
    <table id="userGrid" class="grid" cellpadding="0" cellspacing="0">
        <tbody>
        [#list actionBean.userGrid.resultList as user]
            <tr>
                <td>${user.id}</td>
                <td>${user.country}</td>
                <td>${user.status}</td>
                <td>${user.gender}</td>
                <td>${user.age}</td>
                <td>${user.fname}</td>
                <td>${user.lname}</td>
            </tr>
        [/#list]
        </tbody>
    </table>
    <!-- Pagging -->
    <div id="pager-one"></div>
    <!-- End Pagging, Grid -->

</div>
<!-- End Box Grid 1 -->

<!-- Box Grid 1 Form -->
<div class="box">
    <!-- Box Grid 1 Form Head -->
    <div class="box-head">
        <h2>Grid One Form</h2>
    </div>
    <!-- End Box Grid 1 Form Head -->

    <form id="grid1Form" action="${contextPath}/action/user?show=" method="post">
        <input type="hidden" name="id" id="hidID" />
        <!-- Form -->
        <div class="form">
            <p>
                <span class="req">Char Only</span>
                <label for="txtFName">First Name <span>(Required Field)</span></label>
                <input type="text" class="field size1" name="fname" id="txtFName" />
            </p>
            <p>
                <span class="req">Char Only</span>
                <label for="txtLName">Last Name <span>(Required Field)</span></label>
                <input type="text" class="field size1" name="lname" id="txtLName" />
            </p>
            <p>
                <label for="txtAge">Age</label>
                <input type="text" class="field size5" name="age" id="txtAge" />
            </p>
            <p>
                <label for="cmbCountry">Country of Origin <span>(Required Field)</span></label>
                <select name="country" id="cmbCountry" class="field size4">
                    <option value="">--- Please Select ---</option>
                    <option value="INA">Indonesia</option>
                    <option value="MYS">Malaysia</option>
                    <option value="USA">USA</option>
                </select>
            </p>
            <p>
                <label for="chkActive"><input type="checkbox" name="active" id="chkActive" value="1"/> Active</label>
            </p>
            <p class="inline-field">
                <label>Gender:&nbsp;</label>
                <label for="rdoMale"><input type="radio" name="gender" id="rdoMale" value="M"/> Male</label>
                <label for="rdoFemale"><input type="radio" name="gender" id="rdoFemale" value="F"/> Female</label>
            </p>
        </div>
        <!-- End Form -->

        <!-- Form Buttons -->
        <div class="buttons textright">
            <button class="button" id="btnReset" value="">Reset</button>
            <button class="button" id="btnSubmit" value="" >Submit</button>
        </div>
        <!-- End Form Buttons -->
    </form>
</div>
<!-- End Box Grid 1 Form -->

<!-- Box Grid 2 -->
<div class="box" id="gridTwoBox">

    <!-- Box Grid 2 Head -->
    <div class="box-head">
        <h2 class="left">Grid Two with Row Shift</h2>
    </div>
    <!-- End Box Grid 2 Head -->

    <!-- Grid 2 -->
    <table id="userGridTwo" class="grid" cellpadding="0" cellspacing="0">
        <tbody>
        [#list actionBean.userGrid.resultList as user]
            <tr>
                <td>${user.id}</td>
                <td>${user.age}</td>
                <td>${user.fname}</td>
                <td>${user.lname}</td>
            </tr>
        [/#list]
        </tbody>
    </table>
    <!-- End Grid 2 -->

    <!-- Grid 2 Shift Control -->
    <div id="control-two" class="ui-xytable-control buttons textleft">
        <button class="button grid-two-control up" id="btnShiftGridTwoUp" value="">Up</button>
        <button class="button grid-two-control down" id="btnShiftGridTwoDown" value="">Down</button>
        <button class="button grid-two-control del" id="btnDeleteRow" value="">Delete</button>
    </div>
    <!-- End Grid 2 Shift Control-->

</div>
<!-- End Box Grid 2 -->

<script type="text/javascript" id="xyscript">
$(function() {
    var userGrid = $('#userGrid').xytable({
        highlightOnCheck: true,
        checkOnSelect: true,
        colModel: [
            {name:'id', label:'ID', hidden:true, field:'hidID', id:true, width:50},
            {name:'country', hidden:true, field:'cmbCountry'},
            {name:'active', hidden:true, field:'chkActive'},
            {name:'gender', hidden:true, field:'gender'},
            {name:'age', label:'Age', field:'txtAge', align:'center', width:70},
            {name:'fname', label:'First Name', field:'txtFName'},
            {name:'lname', label:'Last Name', field:'txtLName'}
        ],
        pager: {
            id:'pager-one',
            base:'${contextPath}/action/user',
            page:${actionBean.userGrid.page},
            records:${actionBean.userGrid.totalRecords},
            rows:${actionBean.userGrid.rows}
        },
        sorter: {
            remote: {
                href:'${contextPath}/action/user'[#if actionBean.userGrid.sortx??],
                sortx:'${actionBean.userGrid.sortx}', sortd: ${actionBean.userGrid.sortd}[/#if]
            }
        },
        callback: {
            onSelect: function() { $('#btnSubmit').text('Update'); },
            onUpdate: function() { if (console) { console.debug('onUpdate() Called!'); return true; } }
        }
    }).xytable(); // Get xytable object too

    var gridTwo = $('#userGridTwo').xytable({
        clearOnSelect: true,
        mapToForm: false,
        colModel: [
            {name:'code', label:'ID', width:50, id:true},
            {name:'age', label:'Age', width:70, align:'center'},
            {name:'fname', label:'First Name'},
            {name:'lname', label:'Last Name'}
        ],
        sorter: true
    }).xytable(); // Get xytable object too

    $('.grid-two-control').click(function() {
        // shift up
        if ($(this).is('.up')) {
            gridTwo.ShiftRowUp();
        }
        // shift down
        else if ($(this).is('.down')) {
            gridTwo.ShiftRowDown();
        }
        // delete selected row
        else if ($(this).is('.del')) {
            gridTwo.DeleteRow();
        }
    });

    $('#btnReset').click(function() {
        $('#btnSubmit').text('Submit');
        $('#grid1Form :input').each(function() {
            var input = $(this);
            if (input.is(':button, :submit')) { return; }
            else if (input.is(':text, :hidden, select')) { input.val(''); }
            else if (input.is(':checkbox, :radio')) {
                $(':input[name="'+input.attr('name')+'"]')
                    .each(function() { this.checked = false; });
            }
        });
        // Clear highlighted row
        userGrid.ClearHighlight();
        return false;
    });

    $('#btnSubmit').click(function() {
        var param = $('#grid1Form').jsonSerialize(true);
        userGrid.UpdateRow(param);
        return false;
    });
});
</script>
[/@layout]