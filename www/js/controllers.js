angular.module('app.controllers', [])
     
.controller('dashboardCtrl', function($scope,$ionicPopup, chartData, chartDataWithoutParam) {
  //showing popr for project and sprint selection
  $scope.showPopup = function() {
  $scope.data = {};
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<label class="item item-input card" id="dashboard-input10" style="border-radius:10px 10px 10px 10px;width:90%;"><span class="input-label" style="font-weight:500;font-size:15px;text-align:left;">Sprint</span><input type="text" placeholder="" ng-model="data.sprintNo"></label>'+
                '<div class="spacer " style="width: 100%;"></div><label class="item item-select card" id="projectList-select1" style="border-radius:10px 10px 10px 10px;width:90%;"><span class="input-label" style="font-weight:500;font-size:15px;text-align:left;">Project</span><select style="font-weight:500;font-size:15px;width:90%;" ng-model="data.projectSelect"><option ng-repeat="lst in projectLst" value="{{lst.id}}">{{lst.name}}</option></select></label>',
      title: 'Select Project and Sprint',
      subTitle: '',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Submit</b>',
          type: 'button-positive',
          onTap: function(e) {
            //console.log($scope.data.sprintNo);
            //console.log($scope.data.projectSelect);
            $scope.AllChrts($scope.data.sprintNo, $scope.data.projectSelect);
          }
        }
      ]
    });
  }

  //Effort Extended chart without param
  $scope.allCharts = true;
  $scope.effortExtended = chartDataWithoutParam.getEffortExtendedWithoutParam()
  .then(function(effortExtendedDataWithoutParam) {
        $scope.effortExtended = effortExtendedDataWithoutParam;
        console.log($scope.effortExtended);
  }, function(err) {            
      var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
  });
  //Spent Effort Date chart without param
    $scope.effortDate = chartDataWithoutParam.getEffortDateWithoutParam()
    .then(function(effortdata){
      var effortDateLabel = [];
      var effortDateSeries = [];
      var data1 = [];        
      for(var i=0;i<effortdata[0].buckets.length;i++){
        var a=[];
        effortDateLabel.push(new Date(effortdata[0].buckets[i].key_as_string).toISOString().slice(0,10));
        //loop for getting value with bucket                  
        for(var j=0;j<effortdata[0].buckets[i].aggregations.length;j++){
          a.push(effortdata[0].buckets[i].aggregations[j].value);                
        }
        data1.push(a);
      }
      //loop for names from bucket, which to take only once
      for(var h=0;h<effortdata[0].buckets[h].aggregations.length;h++){
        effortDateSeries.push(effortdata[0].buckets[h].aggregations[h].name);            
      }
      $scope.effortDateLabel = effortDateLabel;
      $scope.effortDateSeries = effortDateSeries;         
      var realignData = _.unzip(data1);    
      $scope.effortDateData = realignData;
      $scope.effortDate = effortdata;
      console.log($scope.effortDate);
    }, function(err){
      var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
    //Burndown chart
    $scope.burndownData = chartDataWithoutParam.getBurndownDataWithoutParam()
      .then(function(burndowndata){
        var burndownLabel = [];
        var burndownSeries = [];
        var data1 = [];
        for(var i=0;i<burndowndata[0].buckets.length;i++){
          var a=[];
          burndownLabel.push(new Date(burndowndata[0].buckets[i].key_as_string).toISOString().slice(0,10));
          //loop for getting value with bucket                  
          for(var j=0;j<burndowndata[0].buckets[i].aggregations.length;j++){
            a.push(burndowndata[0].buckets[i].aggregations[j].value);                
          }
          data1.push(a);
        }
        //loop for names from bucket, which to take only once
        for(var h=0;h<burndowndata[0].buckets[h].aggregations.length;h++){
          burndownSeries.push(burndowndata[0].buckets[h].aggregations[h].name);            
        }
        $scope.burndownLabel = burndownLabel;
        $scope.burndownSeries = burndownSeries;         
        var realignBurndownData = _.unzip(data1);    
        $scope.burndownData = realignBurndownData;      
        console.log($scope.burndowndata);
      }, function(err){
      var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
    // Productivity Date chart   
    $scope.productivityDate = chartDataWithoutParam.getProductivityDateWithoutParam()
      .then(function(productivityDate){
        var productivityDateLabel = [];
        var productivityDateSeries = [];
        var productivityDateData1 = [];
        for(var k=0;k<productivityDate[0].buckets.length;k++){
          var b=[];
          productivityDateLabel.push(new Date(productivityDate[0].buckets[k].key_as_string).toISOString().slice(0,10));

          //loop for getting value with bucket                  
          for(var j=0;j<productivityDate[0].buckets[k].aggregations.length;j++){
            b.push(productivityDate[0].buckets[k].aggregations[j].value);                
          }
          productivityDateData1.push(b);        
        }
        //loop for names from bucket, which to take only once
        for(var h=0;h<productivityDate[0].buckets[h].aggregations.length;h++){
          productivityDateSeries.push(productivityDate[0].buckets[h].aggregations[h].name);            
        }
        $scope.productivityDateLabel = productivityDateLabel;
        $scope.productivityDateSeries = productivityDateSeries;         
        var realignProductivityDateData = _.unzip(productivityDateData1);    
        $scope.productivityDateData = realignProductivityDateData;
        console.log($scope.productivityDateData);
      },function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
    // Quality Date chart   
    $scope.qualityDate = chartDataWithoutParam.getQualityDateWithoutParam()
      .then(function(qualityDate){
        var qualityDateLabel = [];
        var qualityDateSeries = [];
        var qualityDateData1 = [];
        for(var k=0;k<qualityDate[0].buckets.length;k++){
          var b=[];
          qualityDateLabel.push(new Date(qualityDate[0].buckets[k].key_as_string).toISOString().slice(0,10));

          //loop for getting value with bucket                  
          for(var j=0;j<qualityDate[0].buckets[k].aggregations.length;j++){
            b.push(qualityDate[0].buckets[k].aggregations[j].value);                
          }
          qualityDateData1.push(b);        
        }
        //loop for names from bucket, which to take only once
        for(var u=0;u<qualityDate[0].buckets[0].aggregations.length;u++){
          qualityDateSeries.push(qualityDate[0].buckets[0].aggregations[u].name);            
        }
        $scope.qualityDateLabel = qualityDateLabel;
        $scope.qualityDateSeries = qualityDateSeries;         
        var realignQualityDateData = _.unzip(qualityDateData1);    
        $scope.qualityDateData = realignQualityDateData;
        console.log($scope.qualityyDateData);
      },function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
    // Team Date chart   
    $scope.teamDate = chartDataWithoutParam.getTeamDateWithoutParam()
      .then(function(teamDate){
        var teamDateLabel = [];
        var teamDateSeries = [];
        var teamDateData1 = [];
        for(var k=0;k<teamDate[0].buckets.length;k++){
          var b=[];
          teamDateLabel.push(new Date(teamDate[0].buckets[k].key_as_string).toISOString().slice(0,10));

          //loop for getting value with bucket                  
          for(var j=0;j<teamDate[0].buckets[k].aggregations.length;j++){
            b.push(teamDate[0].buckets[k].aggregations[j].value);                
          }
          teamDateData1.push(b);        
        }
        //loop for names from bucket, which to take only once
        for(var u=0;u<teamDate[0].buckets[0].aggregations.length;u++){
          teamDateSeries.push(teamDate[0].buckets[0].aggregations[u].name);            
        }
        $scope.teamDateLabel = teamDateLabel;
        $scope.teamDateSeries = teamDateSeries;         
        var realignTeamDateData = _.unzip(teamDateData1);    
        $scope.teamDateData = realignTeamDateData;
        console.log($scope.teamDateData);
      },function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });


  $scope.setProjectValue = function(projectSelect){
    $scope.projectId = projectSelect;
    console.log($scope.projectId);
  }

  $scope.AllChrts = function(sprintNo, projectId){
    $scope.allCharts = true;
    //Effort Extended chart 
    $scope.effortExtended = '';
    $scope.effortExtended = chartData.getEffortExtended(sprintNo, projectId)
    .then(function(effortExtendedData) {
          $scope.effortExtended = effortExtendedData;
          console.log($scope.effortExtended);
    }, function(err) {            
        var alertPopup = $ionicPopup.alert({
            title: 'Search Failed!',
            template: 'There was some problem with server.'
        });
    });

    //Spent Effort Date chart
    $scope.effortDate = chartData.getEffortDate(sprintNo, projectId)
    .then(function(effortdata){
      var effortDateLabel = [];
      var effortDateSeries = [];
      var data1 = [];        
      for(var i=0;i<effortdata[0].buckets.length;i++){
        var a=[];
        effortDateLabel.push(new Date(effortdata[0].buckets[i].key_as_string).toISOString().slice(0,10));
        //loop for getting value with bucket                  
        for(var j=0;j<effortdata[0].buckets[i].aggregations.length;j++){
          a.push(effortdata[0].buckets[i].aggregations[j].value);                
        }
        data1.push(a);
      }
      //loop for names from bucket, which to take only once
      for(var h=0;h<effortdata[0].buckets[h].aggregations.length;h++){
        effortDateSeries.push(effortdata[0].buckets[h].aggregations[h].name);            
      }
      $scope.effortDateLabel = effortDateLabel;
      $scope.effortDateSeries = effortDateSeries;         
      var realignData = _.unzip(data1);    
      $scope.effortDateData = realignData;
      $scope.effortDate = effortdata;
      console.log($scope.effortDate);
    }, function(err){
      var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
    //Burndown chart
    $scope.burndownData = chartData.getBurndownData(sprintNo, projectId)
      .then(function(burndowndata){
        var burndownLabel = [];
        var burndownSeries = [];
        var data1 = [];
        for(var i=0;i<burndowndata[0].buckets.length;i++){
          var a=[];
          burndownLabel.push(new Date(burndowndata[0].buckets[i].key_as_string).toISOString().slice(0,10));
          //loop for getting value with bucket                  
          for(var j=0;j<burndowndata[0].buckets[i].aggregations.length;j++){
            a.push(burndowndata[0].buckets[i].aggregations[j].value);                
          }
          data1.push(a);
        }
        //loop for names from bucket, which to take only once
        for(var h=0;h<burndowndata[0].buckets[h].aggregations.length;h++){
          burndownSeries.push(burndowndata[0].buckets[h].aggregations[h].name);            
        }
        $scope.burndownLabel = burndownLabel;
        $scope.burndownSeries = burndownSeries;         
        var realignBurndownData = _.unzip(data1);    
        $scope.burndownData = realignBurndownData;      
        console.log($scope.burndowndata);
      }, function(err){
      var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
    // Productivity Date chart   
    $scope.productivityDate = chartData.getProductivityDate(sprintNo, projectId)
      .then(function(productivityDate){
        var productivityDateLabel = [];
        var productivityDateSeries = [];
        var productivityDateData1 = [];
        for(var k=0;k<productivityDate[0].buckets.length;k++){
          var b=[];
          productivityDateLabel.push(new Date(productivityDate[0].buckets[k].key_as_string).toISOString().slice(0,10));

          //loop for getting value with bucket                  
          for(var j=0;j<productivityDate[0].buckets[k].aggregations.length;j++){
            b.push(productivityDate[0].buckets[k].aggregations[j].value);                
          }
          productivityDateData1.push(b);        
        }
        //loop for names from bucket, which to take only once
        for(var h=0;h<productivityDate[0].buckets[h].aggregations.length;h++){
          productivityDateSeries.push(productivityDate[0].buckets[h].aggregations[h].name);            
        }
        $scope.productivityDateLabel = productivityDateLabel;
        $scope.productivityDateSeries = productivityDateSeries;         
        var realignProductivityDateData = _.unzip(productivityDateData1);    
        $scope.productivityDateData = realignProductivityDateData;
        console.log($scope.productivityDateData);
      },function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
    // Quality Date chart   
    $scope.qualityDate = chartData.getQualityDate(sprintNo, projectId)
      .then(function(qualityDate){
        var qualityDateLabel = [];
        var qualityDateSeries = [];
        var qualityDateData1 = [];
        for(var k=0;k<qualityDate[0].buckets.length;k++){
          var b=[];
          qualityDateLabel.push(new Date(qualityDate[0].buckets[k].key_as_string).toISOString().slice(0,10));

          //loop for getting value with bucket                  
          for(var j=0;j<qualityDate[0].buckets[k].aggregations.length;j++){
            b.push(qualityDate[0].buckets[k].aggregations[j].value);                
          }
          qualityDateData1.push(b);        
        }
        //loop for names from bucket, which to take only once
        for(var u=0;u<qualityDate[0].buckets[0].aggregations.length;u++){
          qualityDateSeries.push(qualityDate[0].buckets[0].aggregations[u].name);            
        }
        $scope.qualityDateLabel = qualityDateLabel;
        $scope.qualityDateSeries = qualityDateSeries;         
        var realignQualityDateData = _.unzip(qualityDateData1);    
        $scope.qualityDateData = realignQualityDateData;
        console.log($scope.qualityyDateData);
      },function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
    // Team Date chart   
    $scope.teamDate = chartData.getTeamDate(sprintNo, projectId)
      .then(function(teamDate){
        var teamDateLabel = [];
        var teamDateSeries = [];
        var teamDateData1 = [];
        for(var k=0;k<teamDate[0].buckets.length;k++){
          var b=[];
          teamDateLabel.push(new Date(teamDate[0].buckets[k].key_as_string).toISOString().slice(0,10));

          //loop for getting value with bucket                  
          for(var j=0;j<teamDate[0].buckets[k].aggregations.length;j++){
            b.push(teamDate[0].buckets[k].aggregations[j].value);                
          }
          teamDateData1.push(b);        
        }
        //loop for names from bucket, which to take only once
        for(var u=0;u<teamDate[0].buckets[0].aggregations.length;u++){
          teamDateSeries.push(teamDate[0].buckets[0].aggregations[u].name);            
        }
        $scope.teamDateLabel = teamDateLabel;
        $scope.teamDateSeries = teamDateSeries;         
        var realignTeamDateData = _.unzip(teamDateData1);    
        $scope.teamDateData = realignTeamDateData;
        console.log($scope.teamDateData);
      },function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
  }

  //Project Name and Id List  
    $scope.projectList = chartData.getProjects()
      .then(function(projectLst){
       $scope.projectLst  = projectLst;
      },function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
  

  //Globals
    $scope.myChartOptions = {
        // Boolean - Whether to animate the chart
        animation: true,

        // Number - Number of animation steps
        animationSteps: 60,

        // String - Animation easing effect
        animationEasing: "easeOutQuart",

        // Boolean - If we should show the scale at all
        showScale: true,

        // Boolean - If we want to override with a hard coded scale
        scaleOverride: false,

        // ** Required if scaleOverride is true **
        // Number - The number of steps in a hard coded scale
        scaleSteps: null,
        // Number - The value jump in the hard coded scale
        scaleStepWidth: null,
        // Number - The scale starting value
        scaleStartValue: null,

        // String - Colour of the scale line
        scaleLineColor: "rgba(0,0,0,.1)",

        // Number - Pixel width of the scale line
        scaleLineWidth: 1,

        // Boolean - Whether to show labels on the scale
        scaleShowLabels: true,

        // Interpolated JS string - can access value
        scaleLabel: "<%=value%>",

        // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
        scaleIntegersOnly: true,

        // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: false,

        // String - Scale label font declaration for the scale label
        scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

        // Number - Scale label font size in pixels
        scaleFontSize: 12,

        // String - Scale label font weight style
        scaleFontStyle: "normal",

        // String - Scale label font colour
        scaleFontColor: "#666",

        // Boolean - whether or not the chart should be responsive and resize when the browser does.
        responsive: true,

        // Boolean - Determines whether to draw tooltips on the canvas or not
        showTooltips: false,

        // Array - Array of string names to attach tooltip events
        tooltipEvents: ["mousemove", "touchstart", "touchmove"],

        // String - Tooltip background colour
        tooltipFillColor: "rgba(0,0,0,0.8)",

        // String - Tooltip label font declaration for the scale label
        tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

        // Number - Tooltip label font size in pixels
        tooltipFontSize: 14,

        // String - Tooltip font weight style
        tooltipFontStyle: "normal",

        // String - Tooltip label font colour
        tooltipFontColor: "#fff",

        // String - Tooltip title font declaration for the scale label
        tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

        // Number - Tooltip title font size in pixels
        tooltipTitleFontSize: 14,

        // String - Tooltip title font weight style
        tooltipTitleFontStyle: "bold",

        // String - Tooltip title font colour
        tooltipTitleFontColor: "#fff",

        // Number - pixel width of padding around tooltip text
        tooltipYPadding: 6,

        // Number - pixel width of padding around tooltip text
        tooltipXPadding: 6,

        // Number - Size of the caret on the tooltip
        tooltipCaretSize: 8,

        // Number - Pixel radius of the tooltip border
        tooltipCornerRadius: 6,

        // Number - Pixel offset from point x to tooltip edge
        tooltipXOffset: 10,

        // String - Template string for single tooltips
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

        // String - Template string for single tooltips
        multiTooltipTemplate: "<%= value %>",

        // Function - Will fire on animation progression.
        onAnimationProgress: function(){},

        // Function - Will fire on animation completion.
        onAnimationComplete: function(){}
    }; 
})
 
.controller('updatesCtrl', function($scope) {

})
   
.controller('addNewSprintCtrl', function($scope) {

})
 
 //Sign up controller     
.controller('signUpCtrl', function($scope, signUpData) {
   $scope.signup = function(data) { 
    $scope.accountDtls = {"locked":false,
                          "account": "BARCA"};
    data.locked = false;
    data.account = 'BARCA';
    $scope.signUpDataDtls = data;
     $scope.signup = signUpData.getSignedUp($scope.signUpDataDtls)
      .then(function(signedUpData) {
            $scope.signedUpData = signedUpData;

      }, function(err) {   
          /*var alertPopup = $ionicPopup.alert({
              title: 'Login Failed!',
              template: 'There was some problem with server.'
          });*/
      });
   }
})

//Sign in Controller 
.controller("signInCtrl", function($scope, $ionicPopup, signInData) {
 
     $scope.Login = function(emailid,password) {      
        var emailid = $scope.emailid, 
            password = $scope.password;
        $scope.authTokenForLogin= btoa(this.emailid+":"+this.password);
        $scope.logginIn = signInData.getLoginAuthenticated($scope.authTokenForLogin)
      .then(function(loginData) {
            $scope.loginData = loginData;
      }, function(err) {    
          $scope.submissionSuccess = true;        
          var alertPopup = $ionicPopup.alert({
              title: 'Login Failed!',
              template: 'There was some problem with server.'
          });
      });
    }
})


.controller('MyCtrl', function($scope) {
 $scope.shouldShowDelete = false;
 $scope.shouldShowReorder = false;
 $scope.listCanSwipe = true
})

.controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {

    // An alert dialog
    $scope.showAlert = function(val, val1) {
      var alertPopup = $ionicPopup.alert({
        title: val,
        template: val1,
      });
      alertPopup.then(function(res) {
        //console.log('Thanks');
      });
    };

    // Confirm popup code
    $scope.showConfirm = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Ionic Popup',
        template: 'This is confirm popup'
      });
      confirmPopup.then(function(res) {
        if(res) {
          console.log('You clicked on "OK" button');
        } else {
          console.log('You clicked on "Cancel" button');
        }
      });
    };

    // Prompt popup code
    $scope.showPrompt = function() {
      var promptPopup = $ionicPopup.prompt({
        title: 'Ionic Popup',
        template: 'This is prompt popup'
      });
      promptPopup.then(function(res) {
        if(res) {
          console.log('Your input is ',res);
        }
        else
        {
          console.log('Please enter input');
        }
      });
    };

    // showpopup method code
    $scope.showPopup = function() {
      $scope.data = {}

      var myPopup = $ionicPopup.show({
        template: ' Enter Password<input type="password" ng-model="data.userPassword">   <br> Enter Confirm Password  <input type="password" ng-model="data.confirmPassword" > ',
        title: 'Enter Password',
        subTitle: 'Please use normal things',

        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.userPassword) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data;
              }
            }
          },
        ]
      });
      myPopup.then(function(res) {

        if(res){

            if(res.userPassword==res.confirmPassword)
            {
              console.log('Password Is Ok');
            }
            else
            {
              console.log('Password not matched');
            }
        }
        else
        {
          console.log('Enter password');
        }


      });

    };

  });