angular.module('app.controllers', [])
     
.controller('dashboardCtrl', function($scope,$ionicPopup,$filter,$ionicListDelegate, $ionicModal, $ionicSlideBoxDelegate, $ionicLoading, 
  chartData, chartDataWithoutParam) {
  var technologyList=[];
  var teamListArray=[];
  var finalTeamStructureList = [];


   //slide out function
  /*$scope.isdiplayEffortMetrics = false;
  $scope.showSearchEffortMetrics = function() {
    $scope.isdiplayEffortMetrics = !$scope.isdiplayEffortMetrics;
  }

  $scope.isdiplayQualityMetrics = false;
  $scope.showSearchQualityMetrics = function() {
    $scope.isdiplayQualityMetrics = !$scope.isdiplayQualityMetrics;
  }

  $scope.isdiplayProductivityMetrics = false;
  $scope.showSearchProductivityMetrics = function() {
    $scope.isdiplayProductivityMetrics = !$scope.isdiplayProductivityMetrics;
  }*/

  //show popup on load if user came for the first time or no related data in localstorage 
  $scope.$on('$ionicView.enter', function() {
    // Code you want executed every time view is opened
    $scope.getInitialDetailsFromStoarage = chartDataWithoutParam.getUsersInitialDetails();
    if($scope.getInitialDetailsFromStoarage===null){
      $scope.addProgramDetailsModal.show();
    }
    else{
      var usersInitialDataFromStorage = JSON.parse($scope.getInitialDetailsFromStoarage);
      $scope.program = usersInitialDataFromStorage[0].program;
      $scope.startDate = usersInitialDataFromStorage[0].startDate;
      $scope.endDate = usersInitialDataFromStorage[0].endDate;
      $scope.project = usersInitialDataFromStorage[0].project;
      $scope.interval = usersInitialDataFromStorage[0].interval;
      $scope.interval = $scope.interval;
      $scope.sprint = usersInitialDataFromStorage[0].sprint;

      //$scope.chartsWithoutParam($scope.accountId, usersInitialDataFromStorage[0].project, usersInitialDataFromStorage[0].startDate, usersInitialDataFromStorage[0].endDate, usersInitialDataFromStorage[0].interval);
      $scope.AllChrts($scope.accountId, $scope.program, $scope.sprint, $scope.project, $scope.startDate, $scope.endDate, $scope.interval);
    }
  })
  

  //Get Programs for user's account
  chartDataWithoutParam.getProgramForUser()
    .then(function(userPrograms){
      $scope.userProgramData = userPrograms;
      console.log($scope.userProgramData);
       var userProgramArr = [];
      for(var k=0;k<$scope.userProgramData.data.response.length;k++){
        var usrProg={
          "id": $scope.userProgramData.data.response[k].id,
          "name": $scope.userProgramData.data.response[k].name
        };
        userProgramArr.push(usrProg);
      }

      $scope.userProgramLst = userProgramArr;

    }, function(err){
      var alertPopup = $ionicPopup.alert({
        title: 'Search Failed!',
        template: 'There was some problem with server.'
    });
  });

  //Get Project from Program user selected
  $scope.getProjectOnProgram = function(programId){
    chartDataWithoutParam.getProjectForUser(programId)
      .then(function(userProjects){
          $scope.userProjectData = userProjects;
          console.log($scope.userProjectData);
           var userProjectArr = [];
          for(var r=0;r<$scope.userProjectData.data.response.length;r++){
            var usrProj={
              "id": $scope.userProjectData.data.response[r].id,
              "name": $scope.userProjectData.data.response[r].name
            };
            userProjectArr.push(usrProj);
          }

          $scope.userProjectLst = userProjectArr;
          //$scope.getProjectsList(programId);

        }, function(err){
          var alertPopup = $ionicPopup.alert({
            title: 'Search Failed!',
            template: 'There was some problem with server.'
        });
      });
  }
      


  //slide on button click
  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }

  $scope.previousSlide = function() {
    $ionicSlideBoxDelegate.previous();
  }

  //Get User's Account
  $scope.accountId = chartDataWithoutParam.getUserAccount();

  //Set User's initial details to localstoarage after login
  $scope.setInitialDetails = function(programSelect,projectSelect,startDate,endDate,sprint,interval){
    var startDate = $filter('date')(startDate, "yyyy-MM-dd"+"T00:00:00.000+0530");
    var endDate = $filter('date')(endDate, "yyyy-MM-dd"+"T00:00:00.000+0530");
    var interval = interval;
    var initialDetailsArr=[];
    var initialDetails={
      program:programSelect,
      project:projectSelect,
      startDate:startDate,
      endDate:endDate,
      sprint:sprint,
      interval:interval
    };
    initialDetailsArr.push(initialDetails);
    $scope.initialDeatils = initialDetailsArr;
    chartDataWithoutParam.setUsersInitialDetails(initialDetailsArr);
    $scope.addProgramDetailsModal.hide();
    //$scope.chartsWithoutParam($scope.accountId, programSelect, startDate, endDate, interval);
    $scope.AllChrts($scope.accountId, programSelect, sprint, projectSelect, startDate, endDate, interval);
  }


  $scope.teamList = [];

  //Search team members
  $scope.search = function(data){
    /*$ionicLoading.show({
        templateUrl: "templates/loading.html"
    });*/
      $scope.searchinput = "";
      chartDataWithoutParam.search(data)
        .then(function(searchedData) {
          //$ionicLoading.hide();
          $scope.showFilter = false;
          if (searchedData !== undefined) {
              $scope.showFilter = true;
          }
          if (searchedData === undefined) {
              var alertPopup = $ionicPopup.alert({
                  title: 'Search Failed!',
                  template: 'No result found!',
                  button:[
                    {
                      text: 'Ok',
                      onTap: $scope.teamList = teamListArray
                    }
                  ]
              });
          }


          var teamList={
            id : searchedData[0].id,
            firstname : searchedData[0].firstname,
            lastname : searchedData[0].lastname,
            phone : searchedData[0].phone,
            email : searchedData[0].email,
            profession:searchedData[0].designation.profession,
            specialization:searchedData[0].designation.specialization
          };

          //Creating structure for API
          var finalTeamStructList={
            "user":{
              "id" : searchedData[0].id,
              "email" : searchedData[0].email
            },
            "role" : searchedData[0].designation.profession
          };

          finalTeamStructureList.push(finalTeamStructList);
          console.log(finalTeamStructList);

          $scope.teamListData = teamList;

          var finalTeamList = {teamList:teamList};

          teamListArray.push(finalTeamList);
          $scope.teamList = teamListArray;

          $scope.userProfiles = searchedData;
        }, function(err) {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
              title: 'Search Failed!',
              text: 'err.data.message'
          });
      });
      $scope.teamList = teamListArray;
    }

    //deleting items one by one from list
  $scope.deleteTeamListItem = function (i){
    teamListArray.splice(teamListArray.indexOf(i), 1);    
    $ionicListDelegate.closeOptionButtons();
  };

  //create project snapshot API call
  $scope.projectSnapShot = function(id,sprint,isSprintActive,startDate,endDate,noOfSprint,userStoryCount,spentHours_requirements,spentHours_design,spentHours_build,spentHours_test,spentHours_support,spentHours_unproductive,remainingHours_requirements,remainingHours_design,remainingHours_build,remainingHours_test,remainingHours_support,remainingHours_unproductive,estimatedHours_requirements,estimatedHours_design,estimatedHours_build,estimatedHours_test,estimatedHours_support,estimatedHours_unproductive,qualityMetrics_stats_junit,qualityMetrics_stats_sonarCritical,qualityMetrics_stats_sonarMajor,qualityMetrics_stats_defectSev1,qualityMetrics_stats_defectSev2,qualityMetrics_stats_defectSev3,qualityMetrics_stats_defectSev4,qualityMetrics_stats_defectDensity,productivityMetrics_stats_storypoints,productivityMetrics_stats_velocity){
    var startDate = $filter('date')(startDate, "yyyy-MM-dd"+"T00:00:00.000+0530");
    var endDate = $filter('date')(endDate, "yyyy-MM-dd"+"T00:00:00.000+0530");
    console.log(id,sprint,isSprintActive,startDate,endDate,noOfSprint,userStoryCount,spentHours_requirements,spentHours_design,spentHours_build,spentHours_test,spentHours_support,spentHours_unproductive,remainingHours_requirements,remainingHours_design,remainingHours_build,remainingHours_test,remainingHours_support,remainingHours_unproductive,estimatedHours_requirements,estimatedHours_design,estimatedHours_build,estimatedHours_test,estimatedHours_support,estimatedHours_unproductive,qualityMetrics_stats_junit,qualityMetrics_stats_sonarCritical,qualityMetrics_stats_sonarMajor,qualityMetrics_stats_defectSev1,qualityMetrics_stats_defectSev2,qualityMetrics_stats_defectSev3,qualityMetrics_stats_defectSev4,qualityMetrics_stats_defectDensity,productivityMetrics_stats_storypoints,productivityMetrics_stats_velocity);

    var sprintStatus;
    if(isSprintActive==true)
      {
       sprintStatus= "ACTIVE"
      }
    else
      {
        sprintStatus="INACTIVE"
      }

    //Creating Snapshot structure for api
    var projectSnapShot={
      "logDate": $filter('date')(new Date(),"yyyy-MM-dd"+"T00:00:00.000+0530"),
      "project":{
        "id": id
      },
      "sprint":{
        "id": id+sprint,
        "sprintNumber": sprint,
        "status": sprintStatus,
        "startDate": startDate,
        "endDate": endDate,
        "userStoryCount": userStoryCount,
        "teamMembers": finalTeamStructureList,
        "effortMetrics":{
          "spentHours":{
            "requirements": spentHours_requirements,
            "design": spentHours_design,
            "build": spentHours_build,
            "test": spentHours_test,
            "support": spentHours_support,
            "unproductive": spentHours_unproductive
          },
          "remainingHours":{
            "requirements": remainingHours_requirements,
            "design": remainingHours_design,
            "build": remainingHours_build,
            "test": remainingHours_test,
            "support": remainingHours_support,
            "unproductive": remainingHours_unproductive
          },
          "estimatedHours":{
            "requirements": estimatedHours_requirements,
            "design": estimatedHours_design,
            "build": estimatedHours_build,
            "test": estimatedHours_test,
            "support": estimatedHours_support,
            "unproductive": estimatedHours_unproductive
          }
        },
        "qualityMetrics":{
          "stats":{
            "junit": qualityMetrics_stats_junit,
            "sonarCritical": qualityMetrics_stats_sonarCritical,
            "sonarMajor": qualityMetrics_stats_sonarMajor,
            "DefectsSev1": qualityMetrics_stats_defectSev1,
            "DefectsSev2": qualityMetrics_stats_defectSev2,
            "DefectsSev3": qualityMetrics_stats_defectSev3,
            "DefectsSev4": qualityMetrics_stats_defectSev4,
            "defectDensity": qualityMetrics_stats_defectDensity
          }
        },
        "productivityMetrics":{
          "stats":{
            "storyPoints": productivityMetrics_stats_storypoints,
            "velocity": productivityMetrics_stats_velocity
          }
        }
      }
    };
    console.log(projectSnapShot);
    //calling API
    chartDataWithoutParam.saveSnapShot(projectSnapShot, id)
    .then(function(snapShot){
      $scope.snapshotResponse = snapShot;
      console.log($scope.snapshotResponse);
    }, function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
  }

  /*$scope.addAccount_popup = function(){
    // An elaborate, custom popup
    $scope.myPopup = $ionicPopup.show({
      templateUrl: 'templates/addAccount_popup.html' ,
      title: 'Add Account',
      subTitle: '',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Add Account</b>',
          type: 'button-positive',
          onTap: function(e) {
              var accountName = $scope.accountName;
              $scope.createAccount(accountName);                
          }
        }
      ]
    });
  }*/

  $ionicModal.fromTemplateUrl('templates/addAccount_popup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.addAccountModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/createProject_popup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.createProjectModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/createProgram_popup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.createProgramModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/refineDashboard.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.refineDashbaordModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/addProgramDetails.html', {
    scope: $scope,
    backdropClickToClose: false
  }).then(function(modal) {
    $scope.addProgramDetailsModal = modal;
  });

  

 
  //showing pop up for project and sprint selection
  /*$scope.showPopup = function() {
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
  }*/

  $scope.createAccount = function(accountName){
    chartDataWithoutParam.setCreateAccount(accountName)
      .then(function(accountNameRespopnse) {
          $scope.accountNameResponse = accountNameRespopnse;
      }, function(err) {    
        $scope.submissionSuccess = true;        
        var alertPopup = $ionicPopup.alert({
            title: 'Account not created',
            template: 'There was some problem with server.'
        });
    });
  }

  //selected technology list to add project
  $scope.addTechnologies = function(technologies){
    var tech={
        "name":technologies
      };
      technologyList.push(tech);
      $scope.technologySelected = technologyList;      
      document.getElementById("technologies").value = '';
  }

  //deleting items one by one from list
  $scope.deleteTechnologies = function (i){
    technologyList.splice(technologyList.indexOf(i), 1);    
    $ionicListDelegate.closeOptionButtons();
  };


  //Effort Extended chart without param
  /*$scope.allCharts = true;
  $scope.effortExtended = chartDataWithoutParam.getEffortExtendedWithoutParam()
  .then(function(effortExtendedDataWithoutParam) {
        $scope.effortExtended = effortExtendedDataWithoutParam;
        console.log($scope.effortExtended);
  }, function(err) {            
      var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
  });*/


$scope.chartsWithoutParam = function(accountId, projectId, fromDate, toDate, interval){
  //Effort Extended chart without para$scope.accountId, $scope.getInitialDetailsFromStoarage.project, sprintNo, projectId, fromDate, toDate, intervalm 
  $scope.allCharts = true;
  $scope.effortExtended = chartDataWithoutParam.getEffortExtendedWithoutParam(accountId, projectId, fromDate, toDate, interval)
    .then(function(effortExtendedDataWithoutParam) {
        $scope.effortExtended = effortExtendedDataWithoutParam;
        console.log($scope.effortExtended);
        var myConfig =     {
              "type":"pie",              
              "x":"0%",
              "y":"-20%",
              "background-color":"#ffffff",
              "border-radius":4,
              "legend": {
                  "toggle-action": "remove",
                  "layout":"x5",
                  "x":"10%",
                  "y":"20%",
                  "shadow":false,
                  "background-color": "none",
                  "border-width": 0,
                  "border-color": "none",
                  "item": {
                      "font-color": "black"
                  },
                  "marker":{
                      "type":"circle",
                      "border-width":0
                  }
              },
              "value-box":{
                  "visible":true
              },
              "plotarea":{
                  "margin":"40% 0% 0% 0%"
              },
              "plot":{
                  "slice":50,
                  "ref-angle":270,
                  "detach":false,
                  "hover-state":{
                      "visible":false
                  },
                  "value-box":{
                      "visible":true,
                      "type":"first",
                      "connected":false,
                      "placement":"center",
                      "text":"Total Spent<br>"+  $scope.effortExtended[0].value+" hrs<br>Max Estimate<br>"+ $scope.effortExtended[2].value +" hrs",
                      "font-color":"#000000",
                      "font-size":"10px"
                  },
                  "animation":{
                      "delay":0,
                      "effect":2,
                      "speed":"600",
                      "method":"0",
                      "sequence":"1"
                  }
              },
              "series":[
                  {
                      "values":[$scope.effortExtended[2].value],
                      "text":$scope.effortExtended[2].name + "- <br> " + $scope.effortExtended[2].value + " hrs",
                      "background-color":"#00baf0",
                      "border-width":"0px",
                      "shadow":0
                  },
                  {
                      "values":[$scope.effortExtended[0].value],
                      "text": $scope.effortExtended[0].name + "- <br> " + $scope.effortExtended[0].value + " hrs",
                      "background-color":"#dadada",
                      "alpha":"0.5",
                      "border-color":"#dadada",
                      "border-width":"1px",
                      "shadow":0
                  }
              ]
          };     
    zingchart.render({ 
      id : 'myChart', 
      data : myConfig, 
      height: 450, 
      width: '100%'
    });
    }, function(err) {            
      var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
  });  


  //Spent Effort Date chart without param
    $scope.effortDate = chartDataWithoutParam.getEffortDateWithoutParam(accountId, projectId, fromDate, toDate, interval)
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
      for(var h=0;h<effortdata[0].buckets[0].aggregations.length;h++){
        effortDateSeries.push(effortdata[0].buckets[0].aggregations[h].name);            
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
  //Spent Effort Date chart without param
  $scope.effortDate = chartDataWithoutParam.getEffortDateWithoutParam(accountId, projectId, fromDate, toDate, interval)
    .then(function(effortdata){
      var effortDateLabel = [];
      var effortDateSeries = [];
      var data1 = [];
      var seriesArry = [];
      var seriesColor = ["#882cbb","#2d2c2f","#2f3eac","#54D1F1","#09f42f","#006eee","#f23209"];        
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
      for(var h=0;h<effortdata[0].buckets[0].aggregations.length;h++){
        effortDateSeries.push(effortdata[0].buckets[0].aggregations[h].name);            
      }
      $scope.effortDateLabel = effortDateLabel;
      $scope.effortDateSeries = effortDateSeries;         
      var realignData = _.unzip(data1);

      for(var m=1;m<=$scope.effortDateSeries.length;m++){
        var seriesStruc = {
          "text": $scope.effortDateSeries[m-1],
          "values": realignData[m-1],
          "background-color":seriesColor[m-1],
          "legend-item":{
            "order": ($scope.effortDateSeries.length+1)-m
          }
        };
        seriesArry.push(seriesStruc);
      }
      console.log(seriesArry);
        zingchart.THEME="classic";
        var myConfig = {
            "graphset": [
                {
                  "type": "bar",
                  "background-color": "white",
                  "fill-angle": 55,
                  "stacked": true,
                  "stack-type": "normal",
                  "title": {
                      "text": "Spent Effort Date Histogram",
                      "text-align": "left",
                      "font-family": "Arial",
                      "font-size": "14px",
                      "font-color": "black",
                      "background-color": "none",
                      "padding": "20px 0 0 20px",
                      "height": "40px"
                    },
                  "legend": {
                    "toggle-action": "remove",
                    "layout":"x3",
                    "x":"12.5%",
                    "y":"8.5%",
                    "shadow":false,
                    "background-color": "none",
                    "border-width": 0,
                    "border-color": "none",
                    "item": {
                        "font-color": "black"
                    },
                    "marker":{
                        "type":"circle",
                        "border-width":0
                      }
                    },
                    "plotarea": {
                        "margin": "55px 55px 55px 55px"
                    },
                    "plot": {
                      "alpha": 0.8,
                      "bar-width": "25px",
                      "hover-state": {
                          "background-color": "#212339",
                          "alpha": 1
                        },
                        "animation": {
                            "delay": 350,
                            "effect": 3,
                            "speed": "1000",
                            "method": "0",
                            "sequence": "1"
                        }
                    },
                    "scale-x": {
                        "values": $scope.effortDateLabel,
                        "items-overlap": true,
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "visible": false
                        },
                        "item": {
                            "font-color": "black",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "font-angle": -48,
                            "offset-x": "5px"
                        }
                    },
                    "scale-y": {
                        "value":"",
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "line-style": "solid",
                            "line-color": "#53566f",
                            "line-width": "1px",
                            "alpha": 0.4
                        },
                        "item": {
                            "font-color": "#9a9cab",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "padding": "3px"
                        }
                    },
                    "tooltip": {
                        "text": "<b>%t: %v hrs",
                        "font-family": "Arial",
                        "font-size": "10px",
                        "font-weight": "normal",
                        "font-color": "#fff",
                        "decimals": 0,
                        "text-align": "left",
                        "border-radius": "8px",
                        "padding": "10px 10px",
                        "background-color": "#212339",
                        "alpha": 0.95,
                        "shadow": 0,
                        "border-width": 0,
                        "border-color": "none"
                    },
                    "series": seriesArry 
                }
            ]
        };         
        zingchart.render({ 
          id : 'spentEffortDate', 
          data : myConfig
        });
      console.log($scope.effortDate);
    }, function(err){
      var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
  });
    //Burndown chart
    $scope.burndownData = chartDataWithoutParam.getBurndownDataWithoutParam(accountId, projectId, fromDate, toDate, interval)
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
        for(var h=0;h<burndowndata[0].buckets[0].aggregations.length;h++){
          burndownSeries.push(burndowndata[0].buckets[0].aggregations[h].name);            
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
    $scope.productivityDate = chartDataWithoutParam.getProductivityDateWithoutParam(accountId, projectId, fromDate, toDate, interval)
      .then(function(productivityDate){
        var productivityDateLabel = [];
        var productivityDateSeries = [];
        var productivityDateData1 = [];
        var seriesArry = [];
        var seriesColor = ["#882cbb","#2d2c2f","#2f3eac","#54D1F1","#09f42f","#006eee","#f23209"];
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
        for(var h=0;h<productivityDate[0].buckets[0].aggregations.length;h++){
          productivityDateSeries.push(productivityDate[0].buckets[0].aggregations[h].name);            
        }
        $scope.productivityDateLabel = productivityDateLabel;
        $scope.productivityDateSeries = productivityDateSeries;         
        var realignProductivityDateData = _.unzip(productivityDateData1);    
        $scope.productivityDateData = realignProductivityDateData;
        console.log($scope.productivityDateData);

        for(var m=1;m<=$scope.productivityDateSeries.length;m++){
          var seriesStruc = {
            "text": $scope.productivityDateSeries[m-1],
            "values": realignProductivityDateData[m-1],
            "background-color":seriesColor[m-1],
            "legend-item":{
              "order": ($scope.productivityDateSeries.length+1)-m
            }
          };
          seriesArry.push(seriesStruc);
        }
        console.log(seriesArry);
        zingchart.THEME="classic";
        var myConfig = {
            "graphset": [
                {
                  "type": "bar",
                  "background-color": "white",
                  "fill-angle": 55,
                  "stacked": true,
                  "stack-type": "normal",
                  "title": {
                      "text": "Productivity",
                      "text-align": "left",
                      "font-family": "Arial",
                      "font-size": "14px",
                      "font-color": "black",
                      "background-color": "none",
                      "padding": "20px 0 0 20px",
                      "height": "40px"
                    },
                  "legend": {
                    "toggle-action": "remove",
                    "layout":"x3",
                    "x":"12.5%",
                    "y":"8.5%",
                    "shadow":false,
                    "background-color": "none",
                    "border-width": 0,
                    "border-color": "none",
                    "item": {
                        "font-color": "black"
                    },
                    "marker":{
                        "type":"circle",
                        "border-width":0
                      }
                    },
                    "plotarea": {
                        "margin": "55px 55px 55px 55px"
                    },
                    "plot": {
                      "alpha": 0.8,
                      "bar-width": "25px",
                      "hover-state": {
                          "background-color": "#212339",
                          "alpha": 1
                        },
                        "animation": {
                            "delay": 350,
                            "effect": 3,
                            "speed": "1000",
                            "method": "0",
                            "sequence": "1"
                        }
                    },
                    "scale-x": {
                        "values": $scope.productivityDateLabel,
                        "items-overlap": true,
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "visible": false
                        },
                        "item": {
                            "font-color": "black",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "font-angle": -48,
                            "offset-x": "5px"
                        }
                    },
                    "scale-y": {
                        "value":"",
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "line-style": "solid",
                            "line-color": "#53566f",
                            "line-width": "1px",
                            "alpha": 0.4
                        },
                        "item": {
                            "font-color": "#9a9cab",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "padding": "3px"
                        }
                    },
                    "tooltip": {
                        "text": "<b>%t: %v hrs",
                        "font-family": "Arial",
                        "font-size": "10px",
                        "font-weight": "normal",
                        "font-color": "#fff",
                        "decimals": 0,
                        "text-align": "left",
                        "border-radius": "8px",
                        "padding": "10px 10px",
                        "background-color": "#212339",
                        "alpha": 0.95,
                        "shadow": 0,
                        "border-width": 0,
                        "border-color": "none"
                    },
                    "series": seriesArry 
                }
            ]
        };         
        zingchart.render({ 
          id : 'productivityDate', 
          data : myConfig
        });
      },function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
    // Quality Date chart   
    $scope.qualityDate = chartDataWithoutParam.getQualityDateWithoutParam(accountId, projectId, fromDate, toDate, interval)
      .then(function(qualityDate){
        var qualityDateLabel = [];
        var qualityDateSeries = [];
        var qualityDateData1 = [];
        var seriesArry = [];
        var seriesColor = ["#882cbb","#2d2c2f","#2f3eac","#54D1F1","#09f42f","#006eee","#f23209"];
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
        for(var m=1;m<=$scope.qualityDateSeries.length;m++){
          var seriesStruc = {
            "text": $scope.qualityDateSeries[m-1],
            "values": realignQualityDateData[m-1],
            "background-color":seriesColor[m-1],
            "legend-item":{
              "order": ($scope.qualityDateSeries.length+1)-m
            }
          };
          seriesArry.push(seriesStruc);
        }
        console.log(seriesArry);
        zingchart.THEME="classic";
        var myConfig = {
            "graphset": [
                {
                  "type": "bar",
                  "background-color": "white",
                  "fill-angle": 55,
                  "stacked": true,
                  "stack-type": "normal",
                  "title": {
                      "text": "Quality",
                      "text-align": "left",
                      "font-family": "Arial",
                      "font-size": "14px",
                      "font-color": "black",
                      "background-color": "none",
                      "padding": "20px 0 0 20px",
                      "height": "40px"
                    },
                  "legend": {
                    "toggle-action": "remove",
                    "layout":"x3",
                    "x":"12.5%",
                    "y":"0.5%",
                    "shadow":false,
                    "background-color": "none",
                    "border-width": 0,
                    "border-color": "none",
                    "item": {
                        "font-color": "black"
                    },
                    "marker":{
                        "type":"circle",
                        "border-width":0
                      }
                    },
                    "plotarea": {
                        "margin": "55px 55px 55px 55px"
                    },
                    "plot": {
                      "alpha": 0.8,
                      "bar-width": "25px",
                      "hover-state": {
                          "background-color": "#212339",
                          "alpha": 1
                        },
                        "animation": {
                            "delay": 350,
                            "effect": 3,
                            "speed": "1000",
                            "method": "0",
                            "sequence": "1"
                        }
                    },
                    "scale-x": {
                        "values": $scope.qualityDateLabel,
                        "items-overlap": true,
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "visible": false
                        },
                        "item": {
                            "font-color": "black",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "font-angle": -48,
                            "offset-x": "5px"
                        }
                    },
                    "scale-y": {
                        "value":"",
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "line-style": "solid",
                            "line-color": "#53566f",
                            "line-width": "1px",
                            "alpha": 0.4
                        },
                        "item": {
                            "font-color": "#9a9cab",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "padding": "3px"
                        }
                    },
                    "tooltip": {
                        "text": "<b>%t: %v hrs",
                        "font-family": "Arial",
                        "font-size": "10px",
                        "font-weight": "normal",
                        "font-color": "#fff",
                        "decimals": 0,
                        "text-align": "left",
                        "border-radius": "8px",
                        "padding": "10px 10px",
                        "background-color": "#212339",
                        "alpha": 0.95,
                        "shadow": 0,
                        "border-width": 0,
                        "border-color": "none"
                    },
                    "series": seriesArry 
                }
            ]
        };         
        zingchart.render({ 
          id : 'quality', 
          data : myConfig
        });

      },function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
    // Team Date chart   
    $scope.teamDate = chartDataWithoutParam.getTeamDateWithoutParam(accountId, projectId, fromDate, toDate, interval)
      .then(function(teamDate){
        var teamDateLabel = [];
        var teamDateSeries = [];
        var teamDateData1 = [];
        var seriesArry = [];
        var seriesColor = ["#882cbb","#2d2c2f","#2f3eac","#54D1F1","#09f42f","#006eee","#f23209"];
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
        for(var m=1;m<=$scope.teamDateSeries.length;m++){
          var seriesStruc = {
            "text": $scope.teamDateSeries[m-1],
            "values": realignTeamDateData[m-1],
            "background-color":seriesColor[m-1],
            "legend-item":{
              "order": ($scope.teamDateSeries.length+1)-m
            }
          };
          seriesArry.push(seriesStruc);
        }
        console.log(seriesArry);
        zingchart.THEME="classic";
        var myConfig = {
            "graphset": [
                {
                  "type": "bar",
                  "background-color": "white",
                  "fill-angle": 55,
                  "stacked": true,
                  "stack-type": "normal",
                  "title": {
                      "text": "Team",
                      "text-align": "left",
                      "font-family": "Arial",
                      "font-size": "14px",
                      "font-color": "black",
                      "background-color": "none",
                      "padding": "20px 0 0 20px",
                      "height": "40px"
                    },
                  "legend": {
                    "toggle-action": "remove",
                    "layout":"x3",
                    "x":"12.5%",
                    "y":"0.5%",
                    "shadow":false,
                    "background-color": "none",
                    "border-width": 0,
                    "border-color": "none",
                    "item": {
                        "font-color": "black"
                    },
                    "marker":{
                        "type":"circle",
                        "border-width":0
                      }
                    },
                    "plotarea": {
                        "margin": "55px 55px 55px 55px"
                    },
                    "plot": {
                      "alpha": 0.8,
                      "bar-width": "25px",
                      "hover-state": {
                          "background-color": "#212339",
                          "alpha": 1
                        },
                        "animation": {
                            "delay": 350,
                            "effect": 3,
                            "speed": "1000",
                            "method": "0",
                            "sequence": "1"
                        }
                    },
                    "scale-x": {
                        "values": $scope.teamDateLabel,
                        "items-overlap": true,
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "visible": false
                        },
                        "item": {
                            "font-color": "black",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "font-angle": -48,
                            "offset-x": "5px"
                        }
                    },
                    "scale-y": {
                        "value":"",
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "line-style": "solid",
                            "line-color": "#53566f",
                            "line-width": "1px",
                            "alpha": 0.4
                        },
                        "item": {
                            "font-color": "#9a9cab",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "padding": "3px"
                        }
                    },
                    "tooltip": {
                        "text": "<b>%t: %v %t",
                        "font-family": "Arial",
                        "font-size": "10px",
                        "font-weight": "normal",
                        "font-color": "#fff",
                        "decimals": 0,
                        "text-align": "left",
                        "border-radius": "8px",
                        "padding": "10px 10px",
                        "background-color": "#212339",
                        "alpha": 0.95,
                        "shadow": 0,
                        "border-width": 0,
                        "border-color": "none"
                    },
                    "series": seriesArry 
                }
            ]
        };         
        zingchart.render({ 
          id : 'team', 
          data : myConfig
        });        
      },function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
}


  $scope.setProgramValue = function(programSelect){
    $scope.programId = programSelect;
    console.log($scope.programId);
  }

  $scope.AllChrts = function(accountId, programID, sprintNo, projectId, fromDate, toDate, interval){
    //alert($scope.accountLst);
    $scope.allCharts = true;
    /*var fromDate = $filter('date')(fromDate, "yyyy-MM-dd"+"T00:00:00.000+0530");
    var toDate = $filter('date')(toDate, "yyyy-MM-dd"+"T00:00:00.000+0530");*/

  //Effort Extended chart with param
  $scope.allCharts = true;
  $scope.effortExtended = '';
  $scope.effortExtended = chartData.getEffortExtended(accountId, programID, sprintNo, projectId, fromDate, toDate, interval)
    .then(function(effortExtendedDataWithoutParam) {
          $scope.effortExtended = effortExtendedDataWithoutParam;
          console.log($scope.effortExtended);
          var myConfig =     {
                "type":"pie",              
                "x":"0%",
                "y":"-20%",
                "background-color":"#ffffff",
                "border-radius":4,
                "legend": {
                    "toggle-action": "remove",
                    "layout":"x5",
                    "x":"10%",
                    "y":"20%",
                    "shadow":false,
                    "background-color": "none",
                    "border-width": 0,
                    "border-color": "none",
                    "item": {
                        "font-color": "black"
                    },
                    "marker":{
                        "type":"circle",
                        "border-width":0
                    }
                },
                "value-box":{
                    "visible":true
                },
                "plotarea":{
                    "margin":"40% 0% 0% 0%"
                },
                "plot":{
                    "slice":50,
                    "ref-angle":270,
                    "detach":false,
                    "hover-state":{
                        "visible":false
                    },
                    "value-box":{
                        "visible":true,
                        "type":"first",
                        "connected":false,
                        "placement":"center",
                        "text":"Total Spent<br>"+  $scope.effortExtended[0].value+" hrs<br>Max Estimate<br>"+ $scope.effortExtended[2].value +" hrs",
                        "font-color":"#000000",
                        "font-size":"10px"
                    },
                    "animation":{
                        "delay":0,
                        "effect":2,
                        "speed":"600",
                        "method":"0",
                        "sequence":"1"
                    }
                },
                "series":[
                    {
                        "values":[$scope.effortExtended[2].value],
                        "text":$scope.effortExtended[2].name + "- <br> " + $scope.effortExtended[2].value + " hrs",
                        "background-color":"#00baf0",
                        "border-width":"0px",
                        "shadow":0
                    },
                    {
                        "values":[$scope.effortExtended[0].value],
                        "text": $scope.effortExtended[0].name + "- <br> " + $scope.effortExtended[0].value + " hrs",
                        "background-color":"#dadada",
                        "alpha":"0.5",
                        "border-color":"#dadada",
                        "border-width":"1px",
                        "shadow":0
                    }
                ]
            };     
            zingchart.render({ 
              id : 'myChart', 
              data : myConfig, 
              height: 450, 
              width: '100%'
            });

    }, function(err) {            
        var alertPopup = $ionicPopup.alert({
            title: 'Search Failed!',
            template: 'There was some problem with server.'
        });
    });



/*    //Effort Extended chart 
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
    });*/

    //Spent Effort Date chart with param
    $scope.effortDate = chartData.getEffortDate(accountId, programID, sprintNo, projectId, fromDate, toDate, interval)
      .then(function(effortdata){
        var effortDateLabel = [];
        var effortDateSeries = [];
        var data1 = [];
        var seriesArry = [];
        var seriesColor = ["#882cbb","#2d2c2f","#2f3eac","#54D1F1","#09f42f","#006eee","#f23209"];        
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
        for(var h=0;h<effortdata[0].buckets[0].aggregations.length;h++){
          effortDateSeries.push(effortdata[0].buckets[0].aggregations[h].name);            
        }
        $scope.effortDateLabel = effortDateLabel;
        $scope.effortDateSeries = effortDateSeries;         
        var realignData = _.unzip(data1);

        for(var m=1;m<=$scope.effortDateSeries.length;m++){
          var seriesStruc = {
            "text": $scope.effortDateSeries[m-1],
            "values": realignData[m-1],
            "background-color":seriesColor[m-1],
            "legend-item":{
              "order": ($scope.effortDateSeries.length+1)-m
            }
          };
          seriesArry.push(seriesStruc);
        }
        console.log(seriesArry);
          zingchart.THEME="classic";
          var myConfig = {
              "graphset": [
                  {
                    "type": "bar",
                    "background-color": "white",
                    "fill-angle": 55,
                    "stacked": true,
                    "stack-type": "normal",
                    "title": {
                        "text": "Spent Effort Date Histogram",
                        "text-align": "left",
                        "font-family": "Arial",
                        "font-size": "14px",
                        "font-color": "black",
                        "background-color": "none",
                        "padding": "20px 0 0 20px",
                        "height": "40px"
                      },
                    "legend": {
                      "toggle-action": "remove",
                      "layout":"x3",
                      "x":"12.5%",
                      "y":"8.5%",
                      "shadow":false,
                      "background-color": "none",
                      "border-width": 0,
                      "border-color": "none",
                      "item": {
                          "font-color": "black"
                      },
                      "marker":{
                          "type":"circle",
                          "border-width":0
                        }
                      },
                      "plotarea": {
                          "margin": "55px 55px 55px 55px"
                      },
                      "plot": {
                        "alpha": 0.8,
                        "bar-width": "25px",
                        "hover-state": {
                            "background-color": "#212339",
                            "alpha": 1
                          },
                          "animation": {
                              "delay": 350,
                              "effect": 3,
                              "speed": "1000",
                              "method": "0",
                              "sequence": "1"
                          }
                      },
                      "scale-x": {
                          "values": $scope.effortDateLabel,
                          "items-overlap": true,
                          "line-color": "#53566f",
                          "tick": {
                              "line-color": "#53566f"
                          },
                          "guide": {
                              "visible": false
                          },
                          "item": {
                              "font-color": "black",
                              "font-family": "Arial",
                              "font-size": "10px",
                              "font-angle": -48,
                              "offset-x": "5px"
                          }
                      },
                      "scale-y": {
                          "value":"",
                          "line-color": "#53566f",
                          "tick": {
                              "line-color": "#53566f"
                          },
                          "guide": {
                              "line-style": "solid",
                              "line-color": "#53566f",
                              "line-width": "1px",
                              "alpha": 0.4
                          },
                          "item": {
                              "font-color": "#9a9cab",
                              "font-family": "Arial",
                              "font-size": "10px",
                              "padding": "3px"
                          }
                      },
                      "tooltip": {
                          "text": "<b>%t: %v hrs",
                          "font-family": "Arial",
                          "font-size": "10px",
                          "font-weight": "normal",
                          "font-color": "#fff",
                          "decimals": 0,
                          "text-align": "left",
                          "border-radius": "8px",
                          "padding": "10px 10px",
                          "background-color": "#212339",
                          "alpha": 0.95,
                          "shadow": 0,
                          "border-width": 0,
                          "border-color": "none"
                      },
                      "series": seriesArry 
                  }
              ]
          };         
          zingchart.render({ 
            id : 'spentEffortDate', 
            data : myConfig
          });
        console.log($scope.effortDate);
      }, function(err){
        var alertPopup = $ionicPopup.alert({
            title: 'Search Failed!',
            template: 'There was some problem with server.'
        });
    });

    //Spent Effort Date chart
    /*$scope.effortDate = chartData.getEffortDate(sprintNo, projectId)
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
      for(var h=0;h<effortdata[0].buckets[0].aggregations.length;h++){
        effortDateSeries.push(effortdata[0].buckets[0].aggregations[h].name);            
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
    });*/
    //Burndown chart
    $scope.burndownData = chartData.getBurndownData(accountId, programID, sprintNo, projectId, fromDate, toDate, interval)
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
        for(var h=0;h<burndowndata[0].buckets[0].aggregations.length;h++){
          burndownSeries.push(burndowndata[0].buckets[0].aggregations[h].name);            
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
    $scope.productivityDate = chartData.getProductivityDate(accountId, programID, sprintNo, projectId, fromDate, toDate, interval)
      .then(function(productivityDate){
        var productivityDateLabel = [];
        var productivityDateSeries = [];
        var productivityDateData1 = [];
        var seriesArry = [];
        var seriesColor = ["#882cbb","#2d2c2f","#2f3eac","#54D1F1","#09f42f","#006eee","#f23209"];
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
        for(var h=0;h<productivityDate[0].buckets[0].aggregations.length;h++){
          productivityDateSeries.push(productivityDate[0].buckets[0].aggregations[h].name);            
        }
        $scope.productivityDateLabel = productivityDateLabel;
        $scope.productivityDateSeries = productivityDateSeries;         
        var realignProductivityDateData = _.unzip(productivityDateData1);    
        $scope.productivityDateData = realignProductivityDateData;
        console.log($scope.productivityDateData);

        for(var m=1;m<=$scope.productivityDateSeries.length;m++){
          var seriesStruc = {
            "text": $scope.productivityDateSeries[m-1],
            "values": realignProductivityDateData[m-1],
            "background-color":seriesColor[m-1],
            "legend-item":{
              "order": ($scope.productivityDateSeries.length+1)-m
            }
          };
          seriesArry.push(seriesStruc);
        }
        console.log(seriesArry);
        zingchart.THEME="classic";
        var myConfig = {
            "graphset": [
                {
                  "type": "bar",
                  "background-color": "white",
                  "fill-angle": 55,
                  "stacked": true,
                  "stack-type": "normal",
                  "title": {
                      "text": "Productivity",
                      "text-align": "left",
                      "font-family": "Arial",
                      "font-size": "14px",
                      "font-color": "black",
                      "background-color": "none",
                      "padding": "20px 0 0 20px",
                      "height": "40px"
                    },
                  "legend": {
                    "toggle-action": "remove",
                    "layout":"x3",
                    "x":"12.5%",
                    "y":"8.5%",
                    "shadow":false,
                    "background-color": "none",
                    "border-width": 0,
                    "border-color": "none",
                    "item": {
                        "font-color": "black"
                    },
                    "marker":{
                        "type":"circle",
                        "border-width":0
                      }
                    },
                    "plotarea": {
                        "margin": "55px 55px 55px 55px"
                    },
                    "plot": {
                      "alpha": 0.8,
                      "bar-width": "25px",
                      "hover-state": {
                          "background-color": "#212339",
                          "alpha": 1
                        },
                        "animation": {
                            "delay": 350,
                            "effect": 3,
                            "speed": "1000",
                            "method": "0",
                            "sequence": "1"
                        }
                    },
                    "scale-x": {
                        "values": $scope.productivityDateLabel,
                        "items-overlap": true,
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "visible": false
                        },
                        "item": {
                            "font-color": "black",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "font-angle": -48,
                            "offset-x": "5px"
                        }
                    },
                    "scale-y": {
                        "value":"",
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "line-style": "solid",
                            "line-color": "#53566f",
                            "line-width": "1px",
                            "alpha": 0.4
                        },
                        "item": {
                            "font-color": "#9a9cab",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "padding": "3px"
                        }
                    },
                    "tooltip": {
                        "text": "<b>%t: %v hrs",
                        "font-family": "Arial",
                        "font-size": "10px",
                        "font-weight": "normal",
                        "font-color": "#fff",
                        "decimals": 0,
                        "text-align": "left",
                        "border-radius": "8px",
                        "padding": "10px 10px",
                        "background-color": "#212339",
                        "alpha": 0.95,
                        "shadow": 0,
                        "border-width": 0,
                        "border-color": "none"
                    },
                    "series": seriesArry 
                }
            ]
        };         
        zingchart.render({ 
          id : 'productivityDate', 
          data : myConfig
        });
      },function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    }); 
    // Productivity Date chart   
    /*$scope.productivityDate = chartData.getProductivityDate(sprintNo, projectId)
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
        for(var h=0;h<productivityDate[0].buckets[0].aggregations.length;h++){
          productivityDateSeries.push(productivityDate[0].buckets[0].aggregations[h].name);            
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
    });*/
    // Quality Date chart   
    $scope.qualityDate = chartData.getQualityDate(accountId, programID, sprintNo, projectId, fromDate, toDate, interval)
      .then(function(qualityDate){
        var qualityDateLabel = [];
        var qualityDateSeries = [];
        var qualityDateData1 = [];
        var seriesArry = [];
        var seriesColor = ["#882cbb","#2d2c2f","#2f3eac","#54D1F1","#09f42f","#006eee","#f23209"];
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
        for(var m=1;m<=$scope.qualityDateSeries.length;m++){
          var seriesStruc = {
            "text": $scope.qualityDateSeries[m-1],
            "values": realignQualityDateData[m-1],
            "background-color":seriesColor[m-1],
            "legend-item":{
              "order": ($scope.qualityDateSeries.length+1)-m
            }
          };
          seriesArry.push(seriesStruc);
        }
        console.log(seriesArry);
        zingchart.THEME="classic";
        var myConfig = {
            "graphset": [
                {
                  "type": "bar",
                  "background-color": "white",
                  "fill-angle": 55,
                  "stacked": true,
                  "stack-type": "normal",
                  "title": {
                      "text": "Quality",
                      "text-align": "left",
                      "font-family": "Arial",
                      "font-size": "14px",
                      "font-color": "black",
                      "background-color": "none",
                      "padding": "20px 0 0 20px",
                      "height": "40px"
                    },
                  "legend": {
                    "toggle-action": "remove",
                    "layout":"x3",
                    "x":"12.5%",
                    "y":"0.5%",
                    "shadow":false,
                    "background-color": "none",
                    "border-width": 0,
                    "border-color": "none",
                    "item": {
                        "font-color": "black"
                    },
                    "marker":{
                        "type":"circle",
                        "border-width":0
                      }
                    },
                    "plotarea": {
                        "margin": "55px 55px 55px 55px"
                    },
                    "plot": {
                      "alpha": 0.8,
                      "bar-width": "25px",
                      "hover-state": {
                          "background-color": "#212339",
                          "alpha": 1
                        },
                        "animation": {
                            "delay": 350,
                            "effect": 3,
                            "speed": "1000",
                            "method": "0",
                            "sequence": "1"
                        }
                    },
                    "scale-x": {
                        "values": $scope.qualityDateLabel,
                        "items-overlap": true,
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "visible": false
                        },
                        "item": {
                            "font-color": "black",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "font-angle": -48,
                            "offset-x": "5px"
                        }
                    },
                    "scale-y": {
                        "value":"",
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "line-style": "solid",
                            "line-color": "#53566f",
                            "line-width": "1px",
                            "alpha": 0.4
                        },
                        "item": {
                            "font-color": "#9a9cab",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "padding": "3px"
                        }
                    },
                    "tooltip": {
                        "text": "<b>%t: %v hrs",
                        "font-family": "Arial",
                        "font-size": "10px",
                        "font-weight": "normal",
                        "font-color": "#fff",
                        "decimals": 0,
                        "text-align": "left",
                        "border-radius": "8px",
                        "padding": "10px 10px",
                        "background-color": "#212339",
                        "alpha": 0.95,
                        "shadow": 0,
                        "border-width": 0,
                        "border-color": "none"
                    },
                    "series": seriesArry 
                }
            ]
        };         
        zingchart.render({ 
          id : 'quality', 
          data : myConfig
        });

      },function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
    // Quality Date chart   
    /*$scope.qualityDate = chartData.getQualityDate(sprintNo, projectId)
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
    });*/
    // Team Date chart   
    $scope.teamDate = chartData.getTeamDate(accountId, programID, sprintNo, projectId, fromDate, toDate, interval)
      .then(function(teamDate){
        var teamDateLabel = [];
        var teamDateSeries = [];
        var teamDateData1 = [];
        var seriesArry = [];
        var seriesColor = ["#882cbb","#2d2c2f","#2f3eac","#54D1F1","#09f42f","#006eee","#f23209"];
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
        for(var m=1;m<=$scope.teamDateSeries.length;m++){
          var seriesStruc = {
            "text": $scope.teamDateSeries[m-1],
            "values": realignTeamDateData[m-1],
            "background-color":seriesColor[m-1],
            "legend-item":{
              "order": ($scope.teamDateSeries.length+1)-m
            }
          };
          seriesArry.push(seriesStruc);
        }
        console.log(seriesArry);
        zingchart.THEME="classic";
        var myConfig = {
            "graphset": [
                {
                  "type": "bar",
                  "background-color": "white",
                  "fill-angle": 55,
                  "stacked": true,
                  "stack-type": "normal",
                  "title": {
                      "text": "Team",
                      "text-align": "left",
                      "font-family": "Arial",
                      "font-size": "14px",
                      "font-color": "black",
                      "background-color": "none",
                      "padding": "20px 0 0 20px",
                      "height": "40px"
                    },
                  "legend": {
                    "toggle-action": "remove",
                    "layout":"x3",
                    "x":"12.5%",
                    "y":"0.5%",
                    "shadow":false,
                    "background-color": "none",
                    "border-width": 0,
                    "border-color": "none",
                    "item": {
                        "font-color": "black"
                    },
                    "marker":{
                        "type":"circle",
                        "border-width":0
                      }
                    },
                    "plotarea": {
                        "margin": "55px 55px 55px 55px"
                    },
                    "plot": {
                      "alpha": 0.8,
                      "bar-width": "25px",
                      "hover-state": {
                          "background-color": "#212339",
                          "alpha": 1
                        },
                        "animation": {
                            "delay": 350,
                            "effect": 3,
                            "speed": "1000",
                            "method": "0",
                            "sequence": "1"
                        }
                    },
                    "scale-x": {
                        "values": $scope.teamDateLabel,
                        "items-overlap": true,
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "visible": false
                        },
                        "item": {
                            "font-color": "black",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "font-angle": -48,
                            "offset-x": "5px"
                        }
                    },
                    "scale-y": {
                        "value":"",
                        "line-color": "#53566f",
                        "tick": {
                            "line-color": "#53566f"
                        },
                        "guide": {
                            "line-style": "solid",
                            "line-color": "#53566f",
                            "line-width": "1px",
                            "alpha": 0.4
                        },
                        "item": {
                            "font-color": "#9a9cab",
                            "font-family": "Arial",
                            "font-size": "10px",
                            "padding": "3px"
                        }
                    },
                    "tooltip": {
                        "text": "<b>%t: %v %t",
                        "font-family": "Arial",
                        "font-size": "10px",
                        "font-weight": "normal",
                        "font-color": "#fff",
                        "decimals": 0,
                        "text-align": "left",
                        "border-radius": "8px",
                        "padding": "10px 10px",
                        "background-color": "#212339",
                        "alpha": 0.95,
                        "shadow": 0,
                        "border-width": 0,
                        "border-color": "none"
                    },
                    "series": seriesArry 
                }
            ]
        };         
        zingchart.render({ 
          id : 'team', 
          data : myConfig
        });        
      },function(err){
        var alertPopup = $ionicPopup.alert({
          title: 'Search Failed!',
          template: 'There was some problem with server.'
      });
    });
    // Team Date chart   
    /*$scope.teamDate = chartData.getTeamDate(sprintNo, projectId)
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
    });*/
  }

  //Project Name and Id List

    $scope.projectList = chartData.getProjects()
      .then(function(projectLst){
       var userProjectListArr = [];
          for(var r=0;r<projectLst.length;r++){
            var usrProj={
              "id": projectLst[r].id,
              "name": projectLst[r].name
            };
            userProjectListArr.push(usrProj);
          }

          $scope.usrProjectLst = userProjectListArr;
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

.controller('createAccountCtrl', function($scope){
    
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