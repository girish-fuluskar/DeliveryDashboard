'use strict';

angular.module('app.services', [])
.constant('apiUrl', '@@apiUrl')


.constant("server", "inmbz2239.in.dst.ibm.com")
.constant("port", "8090")
.constant("baseURL","/psd2api/")

//About Service
//Sign Up Data
.service('signUpData', function($state,$http, $q,$ionicPopup,$ionicLoading) {
    this.getSignedUp = function(signUpDataDtls){
       return $q(function(resolve, reject) {
        var req = {
            url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/signup',
            method:'POST',
            headers : {
              'Content-Type':'application/json'
            },
            data: signUpDataDtls
        }
        $http(req)
          .then(function(signedUpData) {
            $state.go('tabsController.dashboard');
            // function to retrive the response
            if (signedUpData.status == 200) {
              resolve(signedUpData);
            } else {
              reject('Sign Up Failed!');
            }
          },
          function(err) {
            reject(err);
          });        
      });
    };
})

.service('createAccount', function($scope,$http, $q,$ionicPopup,$ionicLoading) {
    
})

//Sign in Service
.service('signInData', function($state,$http, $q,$ionicPopup,$ionicLoading) {
    this.getLoginAuthenticated = function(authTokenForLogin){
       return $q(function(resolve, reject) {
        var req = {
            url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/user?id=02689A',
            method:'GET',
            headers : {
              'Authorization' : 'Basic '+authTokenForLogin
            }
            
        }
        $http(req)
          .then(function(loginData) {
            $state.go('tabsController.dashboard');           
            // function to retrive the response
            if (loginData.status == 200) {
              window.localStorage.setItem('authToken', authTokenForLogin);
              resolve(loginData);
              window.localStorage.setItem('accountLst', loginData.data.response.account);
            } else {
              reject('Login Failed!');
            }
          },
          function(err) {
            reject(err);
          });        
      });
    };
})

//chartData without param
.service('chartDataWithoutParam', function($state,$http, $q,$ionicPopup,$ionicLoading) {
  var token = window.localStorage.getItem('authToken');

  this.getUserAccount = function(){
    var account = window.localStorage.getItem('accountLst');
    return account;
  }

  //Saving initial user details to localstoarage
  this.setUsersInitialDetails = function(intialDetails){    
    window.localStorage.setItem('initialDetails', JSON.stringify(intialDetails));
  }

  //Get initial user details from localstoarage
  this.getUsersInitialDetails = function(){
    if (localStorage.getItem('initialDetails') !== null) {
      var getInitialDetails = window.localStorage.getItem('initialDetails');
      return getInitialDetails;
    }
    else{
      return null;
    }
  }
  //Get Programs on the basis of user's account
  this.getProgramForUser = function(){
    var userAccount = window.localStorage.getItem('accountLst');
    console.log("User Account " + userAccount);
    return $q(function(resolve, reject){
      var req = {
        url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+userAccount+'/programs',
        method:'GET',
        headers : {
          'Authorization' : 'Basic '+ token
        }            
      }
      $http(req)
        .then(function(programData) {           
          // function to retrive the response
          if (programData != "") {
            resolve(programData);
          } else {
            reject('No Program found for user');
          }
        },
        function(err) {
          reject(err);
        });  
    });
  }

  //Get Projects on the basis of user selected Program
  this.getProjectForUser = function(programID){
    var userAccount = window.localStorage.getItem('accountLst');
    return $q(function(resolve, reject){
      var req = {
        url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+userAccount+'/'+programID+'/projects',
        method:'GET',
        headers : {
          'Authorization' : 'Basic '+ token
        }            
      }
      $http(req)
        .then(function(projectData) {           
          // function to retrive the response
          if (projectData != "") {
              var userProjectArr = [];
              for(var r=0;r<projectData.data.response.length;r++){
                var usrProj={
                  "id": projectData.data.response[r].id,
                  "name": projectData.data.response[r].name
                };
                userProjectArr.push(usrProj);
              }
              window.localStorage.setItem('useProjectListData', JSON.stringify(userProjectArr));
            resolve(projectData);
          } else {
            reject('No Project found for selected Program');
          }
        },
        function(err) {
          reject(err);
        });  
    });
  }

  this.getProjects = function(){       
    var useProjectListData = JSON.parse(window.localStorage.getItem('useProjectListData'));
    return useProjectListData;
  }
    

  this.setCreateAccount = function(createAccountName){
      var accountStruc={
        "id":createAccountName,
        "name":createAccountName
      };

      return $q(function(resolve, reject){
        var req = {
            url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/account',
            method:'GET',
            headers : {
              'Authorization' : 'Basic '+ token
            },
            data: accountStruc            
        }
        $http(req)
          .then(function(loginData) {           
            // function to retrive the response
            if (loginData.id != "") {
              resolve(loginData);
            } else {
              reject('Login Failed!');
            }
          },
          function(err) {
            reject(err);
          });  
      });
    }


  this.search = function(userData) {
    return $q(function(resolve, reject) {
        var req = {
            url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/users',
            method: 'GET',
            params: {
                fts: userData
            },
            headers: { 
                'Authorization' : 'Basic ' + token
            }
        }
        $http(req).then(function(data) {
            if (data.status == '200') {
                resolve(data.data.response);
            } else {
                reject('Search Failed!');
            }
        }, function(err) {
            reject(err);
        });
    });
  }

  this.saveSnapShot = function(userSelectedProgramId, snapData, projectId){
    return $q(function(resolve, reject) {
      var req = {
          url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+userAccount+userSelectedProgramId+projectId+'/projectsnapshot',
          method: 'POST',
          data: snapData,
          headers: {
              'Content-Type' : 'application/json', 
              'Authorization' : 'Basic ' + token
          }
      }
      $http(req).then(function(data) {
        if (data.status == '200') {
            resolve(data.data.response);
        } else {
            reject('Search Failed!');
        }
      }, function(err) {
          reject(err);
      });
    });
  }

  this.getEffortExtendedWithoutParam = function(accountId, programId, fromDate, toDate, interval) {
    return $q(function(resolve, reject) {   
      var req = {
          url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programId+'/effort/extendedStats',
          method:'GET',
          headers : {
            'Accept' : 'application/json',
            'Content-Type':'application/json', 
            'Authorization' : 'Basic ' + token,                                        
            'fromDate' : fromDate, 
            'toDate' : toDate,
            'interval' : interval
          }
      }               
      $http(req)
        .then(function(effortExtendedDataWithoutParam) {
          console.log(effortExtendedDataWithoutParam);            
          // function to retrive the response
          if (effortExtendedDataWithoutParam.status == 200) {
            resolve(effortExtendedDataWithoutParam.data.response);
          } else {
            reject('Update Expertise Failed!');
          }
        },
        function(err) {
          reject(err);
        });        
    });
  }
  this.getEffortDateWithoutParam = function(accountId, programId, fromDate, toDate, interval){
    return $q(function(resolve, reject) {
      var reqDate = {
          url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programId+'/spentEffort/dateHistogram',
          method:'GET',
          headers : {
            'Accept' : 'application/json',
            'Content-Type':'application/json', 
            'Authorization' : 'Basic ' + token,                                        
            'fromDate' : fromDate, 
            'toDate' : toDate,
            'interval' : interval
          }
      }
      $http(reqDate)
        .then(function(effortDateDataWithoutParam) {
          console.log(effortDateDataWithoutParam);            
          // function to retrive the response
          if (effortDateDataWithoutParam.status == 200) {
            resolve(effortDateDataWithoutParam.data.response);
          } else {
            reject('Update Expertise Failed!');
          }
        },
        function(err) {
          reject(err);
        });
    });
  };
  this.getBurndownDataWithoutParam = function(accountId, programId, fromDate, toDate, interval){
    return $q(function(resolve, reject) {
      var reqDate = {
          url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programId+'/effort/burndown',
          method:'GET',
          headers : {
            'Accept' : 'application/json',
            'Content-Type':'application/json', 
            'Authorization' : 'Basic ' + token,                                        
            'fromDate' : fromDate, 
            'toDate' : toDate,
            'interval' : interval
          }
      }
      $http(reqDate)
        .then(function(burndownDataWithoutParam) {
          console.log(burndownDataWithoutParam);            
          // function to retrive the response
          if (burndownDataWithoutParam.status == 200) {
            resolve(burndownDataWithoutParam.data.response);
          } else {
            reject('Update Expertise Failed!');
          }
        },
        function(err) {
          reject(err);
        });
    });
  };
  this.getProductivityDateWithoutParam = function(accountId, programId, fromDate, toDate, interval){
    return $q(function(resolve, reject) {
      var reqDate = {
          url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programId+'/productivity/dateHistogram',
          method:'GET',
          headers : {
            'Accept' : 'application/json',
            'Content-Type':'application/json', 
            'Authorization' : 'Basic ' + token,                                        
            'fromDate' : fromDate, 
            'toDate' : toDate,
            'interval' : interval
          }
      }
      $http(reqDate)
        .then(function(getProdDateWithoutParam) {
          console.log(getProdDateWithoutParam);            
          // function to retrive the response
          if (getProdDateWithoutParam.status == 200) {
            resolve(getProdDateWithoutParam.data.response);
          } else {
            reject('Update Expertise Failed!');
          }
        },
        function(err) {
          reject(err);
        });
    });
  };
  this.getQualityDateWithoutParam = function(accountId, programId, fromDate, toDate, interval){
    return $q(function(resolve, reject) {
      var reqDate = {
          url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programId+'/quality/dateHistogram',
          method:'GET',
          headers : {
            'Accept' : 'application/json',
            'Content-Type':'application/json', 
            'Authorization' : 'Basic ' + token,                                        
            'fromDate' : fromDate, 
            'toDate' : toDate,
            'interval' : interval
          }
      }
      $http(reqDate)
        .then(function(getQualityDateWithoutParam) {
          console.log(getQualityDateWithoutParam);            
          // function to retrive the response
          if (getQualityDateWithoutParam.status == 200) {
            resolve(getQualityDateWithoutParam.data.response);
          } else {
            reject('Update Expertise Failed!');
          }
        },
        function(err) {
          reject(err);
        });
    });
  };
  this.getTeamDateWithoutParam = function(accountId, programId, fromDate, toDate, interval){
    return $q(function(resolve, reject) {
      var reqDate = {
          url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programId+'/team/dateHistogram',
          method:'GET',
          headers : {
            'Accept' : 'application/json',
            'Content-Type':'application/json', 
            'Authorization' : 'Basic ' + token,                                        
            'fromDate' : fromDate, 
            'toDate' : toDate,
            'interval' : interval
          }
      }
      $http(reqDate)
        .then(function(getTeamDateWithoutParam) {
          console.log(getTeamDateWithoutParam);            
          // function to retrive the response
          if (getTeamDateWithoutParam.status == 200) {
            resolve(getTeamDateWithoutParam.data.response);
          } else {
            reject('Update Expertise Failed!');
          }
        },
        function(err) {
          reject(err);
        });
    });
  };
})

//ChartData Service with params
.service('chartData', function($state,$http, $q,$ionicPopup,$ionicLoading) {

    var token = window.localStorage.getItem('authToken');  
    this.getEffortExtended = function(accountId, programID, sprintNo, projectId, fromDate, toDate, interval) {
      if(interval!=undefined && (projectId!=undefined || projectId!=null)  && (sprintNo!=undefined || sprintNo!=null)){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }          
          var interval = interval+"w";
          var req={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/extendedStats',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{projectId:projectId,sprintId:sprintId}}
        }
        else if(interval===undefined && (projectId===undefined || projectId===null)  && (sprintNo===undefined || sprintNo===null)){
          //var sprintId = projectId.concat(sprintNo);
          //var interval = interval+"w";
          var req={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/extendedStats',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate}}
        }
        else if(interval!=undefined && (projectId===undefined || projectId===null)  && (sprintNo===undefined || sprintNo===null)){
          //var sprintId = projectId.concat(sprintNo);
          var interval = interval+"w";
          var req={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/extendedStats',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval}}
        }
        else if(interval===undefined && (projectId!=undefined || projectId!=null)  && (sprintNo!=undefined || sprintNo!=null)){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          //var interval = interval+"w";
          var req={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/extendedStats',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate},params:{projectId:projectId,sprintId:sprintId}}      
        }
        else if(interval!=undefined && (projectId===undefined || projectId===null) && (sprintNo!=undefined || sprintNo!=null)){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          var interval = interval+"w";
          var req={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/extendedStats',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{sprintId:sprintId}}      
        }
        else if(interval!=undefined && (projectId!=undefined || projectId!=null) && (sprintNo===undefined || sprintNo===null)){
          //var sprintId = projectId.concat(sprintNo);
          var interval = interval+"w";
          var req={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/extendedStats',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{projectId:projectId}}      
        }
        else if(interval===undefined && (projectId!=undefined || projectId!=null) && (sprintNo===undefined || sprintNo===null)){
          //var sprintId = projectId.concat(sprintNo);
          //var interval = interval+"w";
          var req={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/extendedStats',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate},params:{projectId:projectId}}      
        }
      return $q(function(resolve, reject) {   
        /*var req = {
            url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/extendedStats',
            method:'GET',
            headers : {
              'Accept' : 'application/json',
              'Content-Type':'application/json', 
              'Authorization' : 'Basic ' + token,                                        
              'fromDate' : fromDate, 
              'toDate' : toDate,
              'interval' : interval
            },
            params: {                    
                      projectId: projectId,
                      sprintId: sprintId
                  }
        }*/
        req
        $http(req)
          .then(function(effortExtendedData) {
            console.log(effortExtendedData);            
            // function to retrive the response
            if (effortExtendedData.status == 200) {
              resolve(effortExtendedData.data.response);
            } else {
              reject('Update Expertise Failed!');
            }
          },
          function(err) {
            reject(err);
          });        
      });
    };
    this.getEffortDate = function(accountId, programID, sprintNo, projectId, fromDate, toDate, interval){
      if(interval!=undefined && projectId!=undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          var interval = interval+"w";
          var reqDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/spentEffort/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{projectId:projectId,sprintId:sprintId}}
        }
        else if(interval===undefined && projectId===undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          //var interval = interval+"w";
          var reqDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/spentEffort/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate}}
        }
        else if(interval!=undefined && projectId===undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          var interval = interval+"w";
          var reqDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/spentEffort/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval}}
        }
        else if(interval===undefined && projectId!=undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          //var interval = interval+"w";
          var reqDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/spentEffort/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate},params:{projectId:projectId,sprintId:sprintId}}      
        }
        else if(interval!=undefined && projectId===undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          var interval = interval+"w";
          var reqDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/spentEffort/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{sprintId:sprintId}}      
        }
        else if(interval!=undefined && projectId!=undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          var interval = interval+"w";
          var reqDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/spentEffort/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{projectId:projectId}}      
        }
        else if(interval===undefined && projectId!=undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          //var interval = interval+"w";
          var reqDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/spentEffort/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate},params:{projectId:projectId}}      
        }
      return $q(function(resolve, reject) {
        /*var reqDate = {
            url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/spentEffort/dateHistogram',
            method:'GET',
            headers : {
              'Accept' : 'application/json',
              'Content-Type':'application/json', 
              'Authorization' : 'Basic ' + token,                                        
              'fromDate' : fromDate, 
              'toDate' : toDate,
              'interval' : interval
            },
            params: {                    
                      projectId: projectId,
                      sprintId: sprintId
                  }
        }*/
        reqDate
        $http(reqDate)
          .then(function(effortDateData) {
            console.log(effortDateData);            
            // function to retrive the response
            if (effortDateData.status == 200) {
              resolve(effortDateData.data.response);
            } else {
              reject('Update Expertise Failed!');
            }
          },
          function(err) {
            reject(err);
          });
      });
    };    
    this.getBurndownData = function(accountId, programID, sprintNo, projectId, fromDate, toDate, interval){
      if(interval!=undefined && projectId!=undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          var interval = interval+"w";
          var reqBurnData={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/burndown',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{projectId:projectId,sprintId:sprintId}}
        }
        else if(interval===undefined && projectId===undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          //var interval = interval+"w";
          var reqBurnData={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/burndown',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate}}
        }
        else if(interval!=undefined && projectId===undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          var interval = interval+"w";
          var reqBurnData={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/burndown',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval}}
        }
        else if(interval===undefined && projectId!=undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          //var interval = interval+"w";
          var reqBurnData={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/burndown',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate},params:{projectId:projectId,sprintId:sprintId}}      
        }
        else if(interval!=undefined && projectId===undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          var interval = interval+"w";
          var reqBurnData={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/burndown',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{sprintId:sprintId}}      
        }
        else if(interval!=undefined && projectId!=undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          var interval = interval+"w";
          var reqBurnData={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/burndown',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{projectId:projectId}}      
        }
        else if(interval===undefined && projectId!=undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          //var interval = interval+"w";
          var reqBurnData={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/burndown',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate},params:{projectId:projectId}}      
        }
      return $q(function(resolve, reject) {
        /*var reqDate = {
            url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/effort/burndown',
            method:'GET',
            headers : {
              'Accept' : 'application/json',
              'Content-Type':'application/json', 
              'Authorization' : 'Basic ' + token,                                        
              'fromDate' : fromDate, 
              'toDate' : toDate,
              'interval' : interval
            },
            params: {                    
                      projectId: projectId,
                      sprintId: sprintId
                  }
        }*/
        reqBurnData
        $http(reqBurnData)
          .then(function(burndownData) {
            console.log(burndownData);            
            // function to retrive the response
            if (burndownData.status == 200) {
              resolve(burndownData.data.response);
            } else {
              reject('Update Expertise Failed!');
            }
          },
          function(err) {
            reject(err);
          });
      });
    };
    this.getProductivityDate = function(accountId, programID, sprintNo, projectId, fromDate, toDate, interval){
      if(interval!=undefined && projectId!=undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          var interval = interval+"w";
          var reqProdDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/productivity/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{projectId:projectId,sprintId:sprintId}}
        }
        else if(interval===undefined && projectId===undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          //var interval = interval+"w";
          var reqProdDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/productivity/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate}}
        }
        else if(interval!=undefined && projectId===undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          var interval = interval+"w";
          var reqProdDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/productivity/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval}}
        }
        else if(interval===undefined && projectId!=undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          //var interval = interval+"w";
          var reqProdDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/productivity/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate},params:{projectId:projectId,sprintId:sprintId}}      
        }
        else if(interval!=undefined && projectId===undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          var interval = interval+"w";
          var reqProdDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/productivity/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{sprintId:sprintId}}      
        }
        else if(interval!=undefined && projectId!=undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          var interval = interval+"w";
          var reqProdDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/productivity/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{projectId:projectId}}      
        }
        else if(interval===undefined && projectId!=undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          //var interval = interval+"w";
          var reqProdDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/productivity/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate},params:{projectId:projectId}}      
        }
      return $q(function(resolve, reject) {
        /*var reqDate = {
            url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/productivity/dateHistogram',
            method:'GET',
            headers : {
              'Accept' : 'application/json',
              'Content-Type':'application/json', 
              'Authorization' : 'Basic ' + token,                                        
              'fromDate' : fromDate, 
              'toDate' : toDate,
              'interval' : interval
            },
            params: {                    
                      projectId: projectId,
                      sprintId: sprintId
                  }
        }*/
        reqProdDate
        $http(reqProdDate)
          .then(function(getProdDate) {
            console.log(getProdDate);            
            // function to retrive the response
            if (getProdDate.status == 200) {
              resolve(getProdDate.data.response);
            } else {
              reject('Update Expertise Failed!');
            }
          },
          function(err) {
            reject(err);
          });
      });
    };
    this.getQualityDate = function(accountId, programID, sprintNo, projectId, fromDate, toDate, interval){
      if(interval!=undefined && projectId!=undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          var interval = interval+"w";
          var reqQualDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/quality/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{projectId:projectId,sprintId:sprintId}}
        }
        else if(interval===undefined && projectId===undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          //var interval = interval+"w";
          var reqQualDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/quality/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate}}
        }
        else if(interval!=undefined && projectId===undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          var interval = interval+"w";
          var reqQualDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/quality/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval}}
        }
        else if(interval===undefined && projectId!=undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          //var interval = interval+"w";
          var reqQualDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/quality/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate},params:{projectId:projectId,sprintId:sprintId}}      
        }
        else if(interval!=undefined && projectId===undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          var interval = interval+"w";
          var reqQualDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/quality/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{sprintId:sprintId}}      
        }
        else if(interval!=undefined && projectId!=undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          var interval = interval+"w";
          var reqQualDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/quality/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{projectId:projectId}}      
        }
        else if(interval===undefined && projectId!=undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          //var interval = interval+"w";
          var reqQualDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/quality/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate},params:{projectId:projectId}}      
        }
      return $q(function(resolve, reject) {
        /*var reqDate = {
            url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/quality/dateHistogram',
            method:'GET',
            headers : {
              'Accept' : 'application/json',
              'Content-Type':'application/json', 
              'Authorization' : 'Basic ' + token,                                        
              'fromDate' : fromDate, 
              'toDate' : toDate,
              'interval' : interval
            },
            params: {                    
                      projectId: projectId,
                      sprintId: sprintId
                  }
        }*/
        reqQualDate
        $http(reqQualDate)
          .then(function(getQualityDate) {
            console.log(getQualityDate);            
            // function to retrive the response
            if (getQualityDate.status == 200) {
              resolve(getQualityDate.data.response);
            } else {
              reject('Update Expertise Failed!');
            }
          },
          function(err) {
            reject(err);
          });
      });
    };
    this.getTeamDate = function(accountId, programID, sprintNo, projectId, fromDate, toDate, interval){
      if(interval!=undefined && projectId!=undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          var interval = interval+"w";
          var reqTeamDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/team/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{projectId:projectId,sprintId:sprintId}}
        }
        else if(interval===undefined && projectId===undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          //var interval = interval+"w";
          var reqTeamDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/team/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate}}
        }
        else if(interval!=undefined && projectId===undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          var interval = interval+"w";
          var reqTeamDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/team/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval}}
        }
        else if(interval===undefined && projectId!=undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          //var interval = interval+"w";
          var reqTeamDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/team/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate},params:{projectId:projectId,sprintId:sprintId}}      
        }
        else if(interval!=undefined && projectId===undefined && sprintNo!=undefined){
          if(projectId!=null){
            var sprintId = projectId.concat(sprintNo);  
          }
          else{
            var sprintId = "CI001"+ sprintNo;
          }
          var interval = interval+"w";
          var reqTeamDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/team/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{sprintId:sprintId}}      
        }
        else if(interval!=undefined && projectId!=undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          var interval = interval+"w";
          var reqTeamDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/team/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate,'interval':interval},params:{projectId:projectId}}      
        }
        else if(interval===undefined && projectId!=undefined && sprintNo===undefined){
          //var sprintId = projectId.concat(sprintNo);
          //var interval = interval+"w";
          var reqTeamDate={url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/team/dateHistogram',method:'GET',headers : {'Accept':'application/json','Content-Type':'application/json','Authorization':'Basic '+token,'fromDate':fromDate,'toDate':toDate},params:{projectId:projectId}}      
        }
      return $q(function(resolve, reject) {
        /*var reqDate = {
            url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+accountId+'/'+programID+'/team/dateHistogram',
            method:'GET',
            headers : {
              'Accept' : 'application/json',
              'Content-Type':'application/json', 
              'Authorization' : 'Basic ' + token,                                        
              'fromDate' : fromDate, 
              'toDate' : toDate,
              'interval' : interval
            },
            params: {                    
                      projectId: projectId,
                      sprintId: sprintId
                  }
        }*/
        reqTeamDate
        $http(reqTeamDate)
          .then(function(getTeamDate) {
            console.log(getTeamDate);            
            // function to retrive the response
            if (getTeamDate.status == 200) {
              resolve(getTeamDate.data.response);
            } else {
              reject('Update Expertise Failed!');
            }
          },
          function(err) {
            reject(err);
          });
      });
    };

    /*this.getProjectForUser = function(programID){
    var userAccount = window.localStorage.getItem('accountLst');
    return $q(function(resolve, reject){
      var req = {
        url: 'http://inmbz2239.in.dst.ibm.com:8090/deliverydashboard/'+userAccount+'/'+programID+'/projects',
        method:'GET',
        headers : {
          'Authorization' : 'Basic '+ token
        }            
      }
      $http(req)
        .then(function(projectData) {           
          // function to retrive the response
          if (projectData != "") {
            resolve(projectData);
          } else {
            reject('No Project found for selected Program');
          }
        },
        function(err) {
          reject(err);
        });  
    });
  }*/    
})