/**
 * Controllers for the Vacation / APTO
 */
angular.module('ess.timecontroller', [])
.controller('timeStatementController', function( $scope, $rootScope, $state, $stateParams, $compile, EssService ){

    /*if (!$rootScope.sessionUser) //user not logged in
    {
        $state.go('signin');
    }*/

	$scope.title_head = 'My Time';

    var daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];
    var monthNames=['January','February','March','April','May','June',
              'July','August','September','October','November','December'];

    $scope.selectedWeek = 0;

    // this will be used to track the days for a calendar.
    $scope.calendarArray = [];

    $scope.day1Hours = '';
    $scope.day2Hours = '';
    $scope.day3Hours = '';
    $scope.day4Hours = '';
    $scope.day5Hours = '';
    $scope.day6Hours = '';
    $scope.day7Hours = '';
    $scope.totalHours = 0;
    $scope.totalHoursScheduled = 0;
    $scope.overtimeHours = 0;
    $scope.vacationHours = 0;
    $scope.firstDay = '';
    $scope.lastDay = '';
    $scope.firstDayOfCurrentWeek; //date placeholder

    // disable pay statement button flag
    $scope.disablePayStatement = false;
    $scope.disableWeekSummary = false;

    $scope.goToWeekSummary = function(lastDateofWeek){
      $state.go('timeStatementWeekSummary',{id:lastDateofWeek});
      //$state.go('timeStatementWeekSummary',{id:'2017-01-01'});
  	}

    $scope.goToPayStatement = function(lastDateofWeek){
      // determine if we have a pay statement...
      for (var x=0; x<$rootScope.employeeData.TBL_PAYROLL_LIST.length; x++)
      {
        var beginDate =  stringToDate($rootScope.employeeData.TBL_PAYROLL_LIST[x].FPBEGIN_FORMAT,"mm/dd/yyyy","/");
        var endDate =  stringToDate($rootScope.employeeData.TBL_PAYROLL_LIST[x].FPEND_FORMAT,"mm/dd/yyyy","/");
        var lastDateofWeekDate = stringToDate(lastDateofWeek,"mm-dd-yyyy","-");
          if (lastDateofWeekDate >= beginDate &&  lastDateofWeekDate <= endDate)
          {
            $state.go('payrollDetail',{id:$rootScope.employeeData.TBL_PAYROLL_LIST[x].SEQUENCENUMBER});
          }

      }
      //$state.go('timeStatementWeekSummary',{id:lastDateofWeek});
      //$state.go('timeStatementWeekSummary',{id:'2017-01-01'});
  	}

    // logic to toggle / open and close rows
    $scope.toggleRow = function(weekRow, monthIn, yearIn)
    {

        // initialize the flags to disable buttons.
        $scope.disablePayStatement = false;
        $scope.disableWeekSummary = false;

        if ($scope.selectedWeek == weekRow)
        {
            $scope.selectedWeek = 0;
        }
        else
        {
            $scope.selectedWeek = weekRow;
        }

            // get current date... we will use this to hide buttons for dates into the
            // future.
            var currentDate = new Date();

            $scope.day1Hours = 0;
            $scope.day2Hours = 0;
            $scope.day3Hours = 0;
            $scope.day4Hours = 0;
            $scope.day5Hours = 0;
            $scope.day6Hours = 0;
            $scope.day7Hours = 0;
            $scope.totalHours = 0;
            $scope.totalHoursScheduled = 0;
            $scope.totalVacation = 0;
            $scope.totalRegularTimeHours = 0;
            $scope.totalDoubleTimeHours = 0;
            $scope.firstDay = '';
            $scope.lastDay = '';


            var calendarRow = document.getElementById('calendar-row'+weekRow);


            // Set all rows .collapsed
            var allCalendarRows = document.getElementsByClassName("time-calendar-week");
            var i;
            for (i = 0; i < allCalendarRows.length; i++) {
              allCalendarRows[i].className = "time-calendar-week collapsed";
            }
            // Set clicked row not .collapsed
            calendarRow.className = "time-calendar-week expanded";
            calendarRow.setAttribute('aria-expanded', 'true');

            for (var x = 0; x<calendarRow.children.length; x++)
            {

               if (calendarRow.children[x].innerHTML != "") //we have a value.
               {
                   var day = calendarRow.children[x].innerHTML;

                   // we use this to get the specific details for a particular day.
                   var requestedDate = yearIn + '-' + ('0' + ( monthIn +1 )).slice(-2) + '-' + ('0' + day).slice(-2);
                   var timesheetDay = $scope.getTimesheetValue(requestedDate);
                   var hoursWorked = 0;       //initialize hours worked variable
                   var scheduledHours = 0;    //initialize scheduled hours variable
                   if (timesheetDay.HOURS_WORKED)
                    {
                      hoursWorked = timesheetDay.HOURS_WORKED;
                      $scope.totalHours =  parseFloat($scope.totalHours) +  parseFloat(hoursWorked);
                    }

                    if (timesheetDay.REGULARHOURS)
                     {
                       scheduledHours = timesheetDay.REGULARHOURS;
                       $scope.totalHoursScheduled =  parseFloat($scope.totalHoursScheduled) +  parseFloat(scheduledHours);
                     }

                   var requestedDateJs = new Date(yearIn,monthIn,day);
                   // if the requested date is today or in the future, then disable the pay statement button, as we dont have paystatements for future dates.
                   if (requestedDateJs == currentDate || requestedDateJs > currentDate)
                   {
                     $scope.disablePayStatement = true;
                   }

                   // if the requested date is in the future, then disable the week summary  button, as we dont have a week summary for future dates.
                   if (requestedDateJs > currentDate)
                   {
                     $scope.disableWeekSummary = true;
                   }


                   if (!hoursWorked)
                   {
                    hoursWorked = 0;
                   }

                   if (!scheduledHours)
                   {
                    scheduledHours = 0;
                   }

                   if (x == 0)
                   {
                    $scope.day1Hours = hoursWorked;
                    $scope.day1HoursScheduled = scheduledHours;
                    //$scope.totalHours =  parseFloat($scope.totalHours + $scope.day1Hours);
                    $scope.firstDay = day;
                    $scope.lastDay = day;
                    $scope.firstDayOfCurrentWeek = requestedDateJs; //this is used
                   }

                   if (x == 1)
                   {
                    $scope.day2Hours = hoursWorked;
                    $scope.day2HoursScheduled = scheduledHours;
                    //$scope.totalHours =  parseFloat($scope.totalHours + $scope.day2Hours);
                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;
                   }

                   if (x == 2)
                   {
                    $scope.day3Hours = hoursWorked;
                    $scope.day3HoursScheduled = scheduledHours;
                    //$scope.totalHours =  parseFloat($scope.totalHours + $scope.day3Hours);
                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;
                   }

                   if (x == 3)
                   {
                    $scope.day4Hours = hoursWorked;
                    $scope.day4HoursScheduled = scheduledHours;
                    $scope.totalHours =  parseFloat($scope.totalHours + $scope.day4Hours);
                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;
                   }

                   if (x == 4)
                   {
                    $scope.day5Hours = hoursWorked;
                    $scope.day5HoursScheduled = scheduledHours;
                    $scope.totalHours =  parseFloat($scope.totalHours + $scope.day5Hours);
                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;
                   }

                   if (x == 5)
                   {
                    $scope.day6Hours = hoursWorked;
                    $scope.day6HoursScheduled = scheduledHours;
                    //$scope.totalHours =  parseFloat($scope.totalHours + $scope.day6Hours);
                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;
                   }

                   if (x == 6)
                   {
                    $scope.day7Hours = hoursWorked;
                    $scope.day7HoursScheduled = scheduledHours;
                    //$scope.totalHours =  parseFloat($scope.totalHours + $scope.day7Hours);
                    $scope.lastDay = day;
                           if ($scope.firstDay == '')
                            $scope.firstDay = day;
                   }

                  $scope.totalHours =  parseFloat($scope.totalHours.toFixed(2));
                  $scope.totalHoursScheduled =  parseFloat($scope.totalHoursScheduled.toFixed(2));
               }
            }


            //$('#time-detail-1').style.display='block';
            /*$('time-detail-1').style.display='none';
            $('time-detail-2').style.display='none';
            $('time-detail-3').style.display='none';
            $('time-detail-4').style.display='none';
            $('time-detail-5').style.display='none';
            $('time-detail-6').style.display='none';*/


    }

    $scope.getTimesheetValue = function(requestedDate)
    {
     var timesheetLength = $rootScope.employeeData.TBL_TIMEOVERVIEW.length;
        for (var x=0; x<timesheetLength; x++)
             {
                 if ($rootScope.employeeData.TBL_TIMEOVERVIEW[x].VALIDITYDATE == requestedDate)
                 {
                     return $rootScope.employeeData.TBL_TIMEOVERVIEW[x]; //parseFloat($rootScope.employeeData.TBL_TIMEOVERVIEW[x].REGULARHOURS +
                            //$rootScope.employeeData.TBL_TIMEOVERVIEW[x].OVERTIMEHOURS);
                     break;
                 }
             }
     }

     var holidayArray = [
            new Date(2016,0,01), //new Date('January 1, 2016 00:00:00 GMT+0200').getTime(),
            new Date(2016,0,18), //jan1 'January 18, 2016 00:00:00 GMT+0200
             //new Date('May 30, 2016 00:00:00 GMT+0200').getTime(),
             //new Date('July 4, 2016 00:00:00 GMT+0200').getTime(),
             //new Date('September 5, 2016 00:00:00 GMT+0200').getTime(),
             //new Date('November 24, 2016 00:00:00 GMT+0200').getTime(),
             //new Date('December 25, 2016 00:00:00 GMT+0100').getTime(),
             //new Date('January 1, 2017 00:00:00 GMT+0200').getTime(),
             //new Date('January 16, 2017 00:00:00 GMT+0200').getTime(),
             //new Date('July 4, 2017 00:00:00 GMT+0200').getTime(),
             new Date(2016,4,30),
             new Date(2016,6,4),
             new Date(2016,8,5),
             new Date(2016,10,24),
             new Date(2016,11,25),
             new Date(2017,0,01),
             new Date(2017,0,16)] //new Date('December 25, 2017 00:00:00 GMT+0100').getTime()];

    $scope.buildCalendar = function()
    {
            var currentDate = new Date();
            var currentMonth = currentDate.getMonth();
            $scope.month = currentMonth;

            var currentYear = currentDate.getFullYear();
            // we start at the previous year
            var year = currentYear - 1;
            months=13;

            var calendarHTML = '';
            var dayOfWeek = 1;

            $scope.calendarArray.length = 0;

            for (var i=0; i <months; i++){

                // start with the first week of the month
                var weekRow = 0;

               // title
               calendarHTML = calendarHTML + '<div id="calendarMonth'+ i + '">' +
                                '<div class="month-picker">' +
                                  '<md-button class="md-icon-button">' +
                                  '<i class="ion-android-arrow-back" ng-click="prevMonth();"></i>' +
                                  '</md-button>' +
                                  '<h3>' + monthNames[$scope.month] + ' ' + year + '</h3>' +
                                  '<md-button class="md-icon-button">' +
                                  '<i class="ion-android-arrow-forward" ng-click="nextMonth();"></i>' +
                                  '</md-button>' +
                                '</div>';

              // days of the week
               calendarHTML =  calendarHTML +
                                  '<div class="time-calendar">' +
                                  '<div class="time-calendar-heading">' +
                                    '<span>S</span>' +
                                    '<span>M</span>' +
                                    '<span>T</span>' +
                                    '<span>W</span>' +
                                    '<span>T</span>' +
                                    '<span>F</span>' +
                                    '<span>S</span>' +
                                  '</div>';

              firstDayDate = new Date(year,$scope.month,1);
              firstDay=firstDayDate.getDay();

              for (j=0;j<42;j++)
                {
                    if (j%7 == 0)
                    {
                        weekRow = weekRow + 1;
                        dayOfWeek = 1;
                        calendarHTML = calendarHTML +
                        '<div id="calendar-row' + weekRow + $scope.month + year +
                         '" class="time-calendar-week collapsed" data-toggle="collapse" ' +
                         'ng-click="toggleRow(' + weekRow + $scope.month + year + ',' + $scope.month + ',' + year + ')" data-target="#time-detail-' + weekRow + '">';
                    }

                    var daysinMonth = getDaysInMonth($scope.month,year);

                    // update here to get prior month days and next month days... need to use set date
                    if ((j >= firstDay + daysinMonth))
                    {
                      calendarHTML += '<span></span>';
                      //thisDay = (j - firstDay + 1);
                      //calendarHTML = calendarHTML +  '<span>' + thisDay + '</span>';
                      dayOfWeek += 1;
                    }
                    else if ((j < firstDay))
                    {
                      calendarHTML += '<span></span>';
                      //thisDay = (j - firstDay + 1);
                      //calendarHTML = calendarHTML +  '<span>' + thisDay + '</span>';
                      dayOfWeek += 1;
                    }
                    else //regular day...
                    {
                        thisDay = (j - firstDay + 1);

                        // check if a holiday
                        var thisDate = new Date(year,$scope.month,thisDay);
                        var thisDateString = ('0' + ( $scope.month +1 )).slice(-2) + '-' + ('0' + thisDay).slice(-2) + '-' + year;////year + '-' + ('0' + ( $scope.month +1 )).slice(-2) + '-' + ('0' + thisDay).slice(-2);
                        var holidayLength = holidayArray.length;
                        var isHoliday = false;
                        for (var x=0; x<holidayLength; x++)
                        {
                            if (thisDate.toString() == holidayArray[x].toString())
                            {
                              //alert('holiday found'+ thisDate.toString());
                              isHoliday = true;
                              break;
                            }
                        }

                        //var holidayStyle = 'background-color:#fbfd89;color:#000';
                        if (isHoliday)
                        {
                          calendarHTML = calendarHTML + '<span class="time-calendar-holiday" aria-hidden="false">' + thisDay + '</span>';

                          //calendarHTML = calendarHTML +  '<span style="' + holidayStyle + '">' + thisDay + '</span>';
                        }
                        // standard day
                        else {
                        calendarHTML = calendarHTML +  '<span>' + thisDay + '</span>';
                      }
                      //  calendarHTML = calendarHTML +  '<span>' + thisDay + '</span>';


                        dayOfWeek += 1;
                        calendarDate = {};
                        calendarDate.day = thisDay;
                        calendarDate.month = $scope.month;
                        calendarDate.year = year;
                        calendarDate.weekRow = weekRow;
                        calendarDate.dayOfWeek = dayOfWeek;
                        $scope.calendarArray.push(calendarDate);

                    }

                    if (j%7==6)
                    {
                        calendarHTML = calendarHTML +  '</div>'; // end of the week


                        //now show hours worked during that week.
                        calendarHTML = calendarHTML +
                             '<div id="time-detail-' + weekRow + $scope.month + year +
                                '" ng-show="selectedWeek == ' + weekRow + $scope.month + year + '">' +
                                '<div class="time-calendar-values time-calendar-values-worked">' +
                                  '<span>{{day1Hours}}</span>' +
                                  '<span>{{day2Hours}}</span>' +
                                  '<span>{{day3Hours}}</span>' +
                                  '<span>{{day4Hours}}</span>' +
                                  '<span>{{day5Hours}}</span>' +
                                  '<span>{{day6Hours}}</span>' +
                                  '<span>{{day7Hours}}</span>' +
                                '</div>' +
                                '<div class="time-calendar-values time-calendar-values-scheduled">' +
                                  '<span><small>of</small> {{day1HoursScheduled}}</span>' +
                                  '<span><small>of</small> {{day2HoursScheduled}}</span>' +
                                  '<span><small>of</small> {{day3HoursScheduled}}</span>' +
                                  '<span><small>of</small> {{day4HoursScheduled}}</span>' +
                                  '<span><small>of</small> {{day5HoursScheduled}}</span>' +
                                  '<span><small>of</small> {{day6HoursScheduled}}</span>' +
                                  '<span><small>of</small> {{day7HoursScheduled}}</span>' +
                                '</div>' +
                                '<div class="time-calendar-detail">' +
                                  '<h4 class="time-calendar-detail-heading">' + monthNames[$scope.month]+ ' {{firstDay}} - {{lastDay}}</h4>' +
                                  '<dl class="time-calendar-detail-text">' +
                                    '<dt>Scheduled</dt><dd>{{totalHoursScheduled}} hours</dd>' +
                                    '<dt>Actual</dt><dd>{{totalHours}} hours</dd>' +
                                    //'<dt>Overtime</dt><dd>0 hours</dd>' +
                                  '</dl>' +
                                  '<button type="button" ng-click="goToWeekSummary(&quot;' + thisDateString + '&quot;)" ng-hide="disableWeekSummary == true" class="md-button" style="background-color: rgb(72, 72, 72);" md-ripple-size="full">Week Summary</button>' +
                                  '<button type="button" ng-click="goToPayStatement(&quot;' + thisDateString + '&quot;)" ng-hide="disablePayStatement == true" class="md-button" style="background-color: rgb(72, 72, 72);" md-ripple-size="full">Pay Statement</button>' +
                                '</div>' +
                              '</div>';

                    }
              }

              calendarHTML = calendarHTML +   '</div></div>';  //end of the month.
              $scope.month++; // go to next month.
              if ($scope.month>=12){
                $scope.month=0;
                year++;
              }
            }

        var $calendar = $('#calendar');
        $('#calendar').html(calendarHTML);
        $compile($calendar)($scope);
        //document.getElementById('calendar').innerHTML = calendarHTML;
        //console.log(calendarHTML);
    }

      // Returns the number of days in the month in a given year (January=0)
      var getDaysInMonth = function getDaysInMonth(month,year){
        if ((month==1)&&(year%4==0)&&((year%100!=0)||(year%400==0))){
          return 29;
        }else{
          return daysInMonth[month];
        }
      }

      // Performs an action when a date is clicked
      var dateClicked = function dateClicked(day,month,year){
        document.forms.calendar.date.value=
           month+'/'+day+'/'+year; // American
          //day+'/'+month+'/'+year;    // European
          // year+'/'+month+'/'+day' // Far Eastern
      }

      // Sets the displayed month
      var setDisplayedMonth = function setDisplayedMonth(month){

        $scope.selectedWeek = 0;
        if (month < 0){
            $scope.showAlert('Info', 'You have reached the beginning of this calendar');
           //alert('You have reached the beginning of this calendar');
        }else if ($scope.month>=months){
            $scope.showAlert('Info', 'You have reached the end of this calendar');
           //alert('You have reached the end of this calendar');
        }else{
          for (var i=0;i<months;i++){
            document.getElementById('calendarMonth'+i).style.display='none';
          }
            document.getElementById('calendarMonth'+month).style.display='block';
        }
      }

      // Sets the displayed month
      $scope.nextMonth = function()
      {
          if ($scope.month != months)
          {
              $scope.month = $scope.month+1;
              setDisplayedMonth($scope.month)
          }
      }

      // Sets the displayed month
      $scope.prevMonth = function()
      {
          $scope.month = $scope.month-1;
          setDisplayedMonth($scope.month)
      }

    $scope.buildCalendar();
    // initialize displayed month.

    //var currentDate = new Date();
    //var currentMonth = currentDate.getMonth();
    $scope.month = 12;
    setDisplayedMonth(12);
})
.controller('timeWeekSummaryController', function( $scope, $rootScope, $state, $stateParams, EssService ){

  $scope.message = '';
  $scope.lastDateofWeek = $stateParams.id; //$routeParams.id;
  $scope.weekName = '';
  $scope.weekList = [];
  $scope.weekSummary = [];

  $scope.getWeekSummary = function(requestedDate)
  {

   var lastDateOfWeek = stringToDate(requestedDate,"mm-dd-yyyy","-");
   var firstDateOfWeek = subtractDays(lastDateOfWeek, 6);
   var timesheetLength = $rootScope.employeeData.TBL_TIMEOVERVIEW.length;
   // gets the specific clock in and clock out times.
      for (var x=0; x<timesheetLength; x++)
           {
               var thisDate = stringToDate($rootScope.employeeData.TBL_TIMEOVERVIEW[x].VALIDITYDATE, "yyyy-mm-dd","-");
               if (thisDate >= firstDateOfWeek && thisDate <= lastDateOfWeek)
               {
                 console.log('found a date' + thisDate.toString());
                 if ($rootScope.employeeData.TBL_TIMEOVERVIEW[x].HOURS_WORKED != "0.00")
                 {
                   $scope.weekList.push($rootScope.employeeData.TBL_TIMEOVERVIEW[x]);
                 }
               }
           }

    // gets the summary time-statement
    var timesheetLength = $rootScope.employeeData.TBL_TIMESUMMARY.length;
    // gets the specific clock in and clock out times.
       for (var x=0; x<timesheetLength; x++)
            {
                var thisDate = stringToDate($rootScope.employeeData.TBL_TIMESUMMARY[x].DATUM, "yyyy-mm-dd","-");
                if (thisDate.toDateString() == firstDateOfWeek.toDateString())
                {
                  console.log('found the week start date' + thisDate.toString());
                    $scope.weekSummary.push($rootScope.employeeData.TBL_TIMESUMMARY[x]);
                }
            }

    $scope.weekName =  firstDateOfWeek.toDateString();


   }

   // get the statement details
   if ($scope.lastDateofWeek)
   {
       $scope.getWeekSummary($scope.lastDateofWeek);
   }


});


function stringToDate(_date,_format,_delimiter)
{
  // example calls
  /*
  stringToDate("17/9/2014","dd/MM/yyyy","/");
  stringToDate("9/17/2014","mm/dd/yyyy","/")
  stringToDate("9-17-2014","mm-dd-yyyy","-")
  */
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function subtractDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

function toDate(dateStr) {
    var parts = dateStr.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}
