[#ftl]
[#--
 * File: layout.ftl
 *
 * @author imam
--]
[#include "/WEB-INF/ftl/common.ftl"/]
[#macro layout title="title"]
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <title>${title}</title>
        <!-- Core CSS -->
        <link rel="stylesheet" href="${contextPath}/css/style.css" type="text/css" media="all" />

        <!-- Core JS Library : jQuery v1.4.x -->
        <script type="text/javascript" src="${contextPath}/js/lib/jquery-1.4.2.js"></script>

        <!-- Required Plugins by Client-side Sorting & Pagination Feature -->
        <script type="text/javascript" src="${contextPath}/js/plugins/jquery.ba-bbq.min.js"></script>
        <script type="text/javascript" src="${contextPath}/js/plugins/jquery.xycommon.min.js"></script>
        <script type="text/javascript" src="${contextPath}/js/plugins/jquery.tablesorter.min.js"></script>

        <!-- XYTable jQuery Plugin & CSS -->
        <script type="text/javascript" src="${contextPath}/js/xytable/jquery.xytable.js"></script>
        <link rel="stylesheet" href="${contextPath}/js/xytable/css/xytable.css" type="text/css" media="screen,projection,print" />

        <!-- Syntax Highlighting -->
        <script type="text/javascript" src="${contextPath}/js/syntaxhighlighter/shCore.js"></script>
        <script type="text/javascript" src="${contextPath}/js/syntaxhighlighter/shBrushJScript.js"></script>
        <link type="text/css" rel="stylesheet" href="${contextPath}/js/syntaxhighlighter/css/shCore.css"/>
        <link type="text/css" rel="stylesheet" href="${contextPath}/js/syntaxhighlighter/css/shThemeDefault.css"/>

        <!-- Fix stylesheet for Webkit -->
        <link rel="stylesheet" href="${contextPath}/css/webkitfix.css" type="text/css" media="screen,projection" />

        <script type="text/javascript">
        $(function() {
            $('#usage').text($('#xyscript').html());
            SyntaxHighlighter.config.clipboardSwf = 'js/syntaxhighlighter/clipboard.swf';
            SyntaxHighlighter.all();

            $(window).scroll(function() {
                var scrolled = Math.ceil($(window).scrollTop());
                $('#header-floating')[scrolled > $('#container').offset().top ? 'fadeIn' : 'fadeOut']();
            });

            $('#btnTop').click(function() {
                $('html, body').animate({
                    scrollTop: $('#header').offset().top
                }, 500);
            });

            $('a.active').click(function() {return false;});
        });
        </script>
    </head>
    <body>
        <!-- Header -->
        <div id="header">
            <div class="shell">
                <!-- Logo + Top Nav -->
                <div id="top">
                    <h1><a href="#">jQuery XYTable Implementation</a></h1>
                </div>
                <!-- End Logo + Top Nav -->

                <!-- Main Nav -->
                <div id="navigation">
                    <ul>
                        <li><a href="${contextPath}/action/user" id="nonAjax" class="[#if !actionBean.ajax]active[/#if]" title="jQuery XYTable Implementation"><span>Not Ajax</span></a></li>
                        <li><a href="${contextPath}/action/user?ajaxPage=" id="ajax" class="[#if actionBean.ajax]active[/#if]" title="jQuery XYTable AJAX Implementation"><span>Ajax</span></a></li>
                    </ul>
                </div>
                <!-- End Main Nav -->
            </div>
        </div>
        <!-- End Header -->

        <!-- Container -->
        <div id="container">
            <div class="shell">

                <!-- End Message Error -->
                <br style="display: none;"/>
                <!-- Main -->
                <div id="main">
                    <div class="cl">&nbsp;</div>

                    <!-- Content -->
                    <div id="content">

                        [#nested/]

                        <!-- Box Box XYTable Usage Source -->
                        <div class="box" id="sourcebox">
                            <div class="box-head">
                                <h2 class="left">Source Code</h2>
                            </div>
                            <pre class="brush: js" id="usage"></pre>
                        </div>
                        <!-- End Box XYTable Usage Source -->
                    </div>
                    <!-- End Content -->

                    <!-- Sidebar -->
                    <div id="sidebar">

                        <!-- Sidebar Box -->
                        <div class="box">

                            <!-- Sidebar Box Head -->
                            <div class="box-head">
                                <h2>Requirements</h2>
                            </div>
                            <!-- End Sidebar Box Head-->

                            <div class="box-content">
                                <ul style="margin:0 0 0 10px; font-size:110%;">
                                    <li>jQuery 1.4.x</li>
                                    <li>jQuery Plugin: xycommon (<code>jquery.xycommon.js</code>)</li>
                                    <li>jQuery Plugin: <a href="http://benalman.com/code/projects/jquery-bbq/docs/files/jquery-ba-bbq-js.html">ba-bbq</a><br/>(<code>Pagination feature</code>)</li>
                                    <li>jQuery Plugin: <a href="http://tablesorter.com">tablesorter</a><br/>(<code>Sortable column feature</code>)</li>
                                </ul>
                            </div>
                        </div>
                        <!-- End Sidebar Box -->
                    </div>
                    <!-- End Sidebar -->

                    <div class="cl">&nbsp;</div>
                </div>
                <!-- Main -->
            </div>
        </div>
        <!-- End Container -->

        <!-- Footer -->
        <div id="footer">
            <div class="shell">
                <span class="left">&copy; 2010 - <a href="http://www.xybase.co.id">XYBASE Indonesia</a></span>
                <span class="right">
                    Design by <a href="http://chocotemplates.com" target="_blank" title="The Sweetest CSS Templates WorldWide">Chocotemplates.com</a>
                </span>
            </div>
        </div>
        <!-- End Footer -->

        <!-- Floating Header -->
        <div id="header-floating" style="display:none;">
            <span class="h4">${title}</span>
            <span class="actions"><input class="button" type="button" name="btnTop" id="btnTop" value="Top"/></span>
        </div>
        <!-- End Floating Header -->
    </body>
</html>
[/#macro]