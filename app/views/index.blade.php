<!doctype html>
<html lang="en" ng-app="eaApp">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Episode Alert</title>
    <base href="/"/>

    <% HTML::style('//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css') %>
    <% HTML::style(asset('css/global.css')) %>

    <% HTML::script('//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js') %>
    <% HTML::script('//ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular.min.js') %>
    <% HTML::script('//ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-route.min.js') %>
    <% HTML::script('//ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-animate.min.js') %>
    <% HTML::script('//ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-touch.js') %>
    
    <% HTML::script('/js/vendor/ui-bootstrap-0.12.0.js') %>
    <% HTML::script('//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js') %>
    <% HTML::script('/js/vendor/_bower.js') %>

</head>
<body>

@if (App::environment() == 'local')
<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>
@endif
<!-- <div class="background-container"></div> -->
<div id="masterUI" ui-view="master">
    <!-- loaded by templates-->
    <div id="topbarUI" ui-view="topbar">
        <nav class="navbar navbar-default" role="navigation">
            <div class="container container--navbar">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="/">
                        <!-- <img src="img/logo-56x41.png" alt="Episode Alert" /> -->
                        Episode Alert
                    </a>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <form class="navbar-form navbar-left" role="search">
                        <div class="input-group">
                            <input ng-controller="SearchBoxCtrl" type="text" class="form-control form-control-search" placeholder="Search" ng-model="mainPageQuery" ng-model-options="{ debounce: 300 }" />
                            <span class="input-group-btn">
                                <button type="submit" class="btn btn-default"><span class="glyphicon glyphicon-search"></span></button>
                            </span>
                        </div>
                    </form>
                    <ul class="nav navbar-nav" ng-controller="HeaderCtrl">
                        <li ng-class="{ active: isActive('/series')}"><a href="/series/genre/action">Browse</a></li>
                        <li ng-class="{ active: isActive('/trending')}"><a href="/trending">Trending</a></li>
                        <li ng-class="{ active: isActive('/profile')}"><a href="/profile">Profile</a></li>
                        <li ng-show="credentials.auth">
                            <a href="#" ng-controller="LoginCtrl" ng-click="logout()">Logout</a>
                        </li>
                        <li ng-show="!credentials.auth">
                            <a ng-show="!credentials.auth" href="/login">Login</a>
                        </li>                                        
                    </ul>

                    <p class="navbar-text navbar-right hide-xs hidden-sm" ng-show="credentials.auth">Welcome back, <a href="/profile" class="navbar-link">{{ credentials.username }}</a></p>
                </div>
            </div>
        </nav>
    </div>
    <div class="container">
        <div class="row flash-container">
            <div class="col-md-12 col-lg-12">    
                <flash:messages class="animation" />
            </div>
        </div>
    </div>
    <div id="fb-root"></div>
    <div id="contentUI" ui-view="content" class="container ea-content fade" ng-view>
    </div>
    <div class="container" id="footer">
        <div class="footer row">
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">    
                Copyright 2015
            </div>        
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">    
                Contact :: Privacy
            </div>
        </div>    
    </div>
    <div id="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    </div>
</div>

<script>
    var clientId = '<% $clientId %>';
    var state = '<% $state %>';
    var fbAppId = '<% $fbAppId %>';
    
    /**
      * dirty hack because twitter bootstrap mobile first responsive
      * framework does not support closing the mobile menu on click for SPA's
    */    
    $(document).on('click','.navbar-collapse.in',function(e) {
        if( $(e.target).is('a') ) {
            $(this).collapse('hide');
        }
    });    
</script>

<% HTML::script(asset('js/app.js')) %>

<% HTML::script(asset('js/controllers/carouselController.js')) %>
<% HTML::script(asset('js/controllers/seriesDetailController.js')) %>
<% HTML::script(asset('js/controllers/seriesListController.js')) %>
<% HTML::script(asset('js/controllers/seriesController.js')) %>
<% HTML::script(asset('js/controllers/seriesSearchController.js')) %>
<% HTML::script(asset('js/controllers/profileController.js')) %>
<% HTML::script(asset('js/controllers/followingController.js')) %>
<% HTML::script(asset('js/controllers/seenController.js')) %>
<% HTML::script(asset('js/controllers/guideController.js')) %>
<% HTML::script(asset('js/controllers/profileHeaderController.js')) %>
<% HTML::script(asset('js/controllers/profileSettingsController.js')) %>
<% HTML::script(asset('js/controllers/searchBoxController.js')) %>

<% HTML::script(asset('js/factories/authenticationFactory.js')) %>
<% HTML::script(asset('js/factories/seriesFactory.js')) %>
<% HTML::script(asset('js/factories/oauthFactory.js')) %>
<% HTML::script(asset('js/factories/userSettingsFactory.js')) %>

<% HTML::script(asset('js/services/searchService.js')) %>

<% HTML::script(asset('js/directives/eaTab.js')) %>

<% HTML::script(asset('js/modules/angular-flash.js')) %>
</body>
</html>

