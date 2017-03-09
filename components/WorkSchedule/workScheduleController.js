/**
 * Controllers for the Vacation / APTO
 */
angular.module('ess.schedulecontroller', [])
.controller('workScheduleController', function( $scope, $rootScope, $state, $stateParams, $compile, EssService ){

    /*if (!$rootScope.sessionUser) //user not logged in
    {
        $state.go('signin');
    }*/

	$scope.title_head = 'My Schedule';

    var daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];
    var monthNames=['January','February','March','April','May','June',
              'July','August','September','October','November','December'];

    $scope.selectedWeek = 0;

    // this will be used to track the days for a calendar.
    $scope.calendarArray = [];

    $scope.day1StartTime = '';
    $scope.day2StartTime = '';
    $scope.day3StartTime = '';
    $scope.day4StartTime = '';
    $scope.day5StartTime = '';
    $scope.day6StartTime = '';
    $scope.day7StartTime = '';
    $scope.totalHours = 0;
    $scope.totalHoursScheduled = 0;
    $scope.overtimeHours = 0;
    $scope.vacationHours = 0;
    $scope.firstDay = '';
    $scope.lastDay = '';
    $scope.firstDayOfCurrentWeek; //date placeholder
    $scope.currentWeek; // this is a placeholder for the current week.
    $scope.currentMonth;
    $scope.currentYear;

    // disable pay statement button flag
    $scope.disablePayStatement = false;
    $scope.disableWeekSummary = false;

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

            $scope.day1StartTime = 0;
            $scope.day2StartTime = 0;
            $scope.day3StartTime = 0;
            $scope.day4StartTime = 0;
            $scope.day5StartTime = 0;
            $scope.day6StartTime = 0;
            $scope.day7StartTime = 0;
            $scope.day1label = 'to';
            $scope.day2label = 'to';
            $scope.day3label = 'to';
            $scope.day4label = 'to';
            $scope.day5label = 'to';
            $scope.day6label = 'to';
            $scope.day7label = 'to';

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
                   var timesheetDay = $scope.getWorkScheduleValue(requestedDate);
                   var startTime = 0;
                   var endTime = 0;
                   var scheduledHours = 0;    //initialize scheduled hours variable

                   if (timesheetDay.TPROG == 'FREE') //holiday
                   {
                      startTime = 'Off';
                      endTime = '';

                   }
                   else //work hours
                   {
                     if (timesheetDay.BEGZT)
                      {
                        startTime = timesheetDay.BEGZT;
                        //replace end of the data because we don't use seconds
                        startTime = startTime.replace(':00', '');
                        var firstchar = startTime.charAt(0);
                        if (firstchar == '0')
                        {
                          startTime = startTime.substr(1);
                        }
                      }

                      if (timesheetDay.ENDZT)
                       {
                         endTime = timesheetDay.ENDZT;
                         //replace end of the data because we don't use seconds
                         endTime = endTime.replace(':00', '');
                         var firstchar = endTime.charAt(0);
                         if (firstchar == '0')
                         {
                           endTime = endTime.substr(1);
                         }
                       }

                   }


                    if (timesheetDay.STDAZ)
                     {
                       scheduledHours = timesheetDay.STDAZ;
                       $scope.totalHoursScheduled =  parseFloat($scope.totalHoursScheduled) +  parseFloat(scheduledHours);
                     }

                   var requestedDateJs = new Date(yearIn,monthIn,day);
                   // if the requested date is today or in the future, then disable the pay statement button, as we dont have paystatements for future dates.
                   if (requestedDateJs == currentDate || requestedDateJs > currentDate)
                   {
                     //$scope.disablePayStatement = true;
                   }

                   // if the requested date is in the future, then disable the week summary  button, as we dont have a week summary for future dates.
                   if (requestedDateJs > currentDate)
                   {
                     //$scope.disableWeekSummary = true;
                   }


                   if (!scheduledHours)
                   {
                    scheduledHours = 0;
                   }

                   if (x == 0)
                   {
                    $scope.day1StartTime = startTime;
                    $scope.day1EndTime = endTime;

                    $scope.firstDay = day;
                    $scope.lastDay = day;
                    $scope.firstDayOfCurrentWeek = requestedDateJs; //this is used

                    if (timesheetDay.TPROG == 'FREE')
                    {
                      $scope.day1label = '';
                    }
                    else
                    {
                      $scope.day1label = 'to';
                    }

                   }

                   if (x == 1)
                   {
                    $scope.day2StartTime = startTime;
                    $scope.day2EndTime = endTime;

                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;

                            if (timesheetDay.TPROG == 'FREE')
                            {
                              $scope.day2label = '';
                            }
                            else
                            {
                              $scope.day2label = 'to';
                            }
                   }

                   if (x == 2)
                   {
                    $scope.day3StartTime = startTime;
                    $scope.day3EndTime = endTime;

                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;

                            if (timesheetDay.TPROG == 'FREE')
                            {
                              $scope.day3label = '';
                            }
                            else
                            {
                              $scope.day3label = 'to';
                            }
                   }

                   if (x == 3)
                   {
                    $scope.day4StartTime = startTime;
                    $scope.day4EndTime = endTime;

                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;

                            if (timesheetDay.TPROG == 'FREE')
                            {
                              $scope.day4label = '';
                            }
                            else
                            {
                              $scope.day4label = 'to';
                            }
                   }

                   if (x == 4)
                   {
                    $scope.day5StartTime = startTime;
                    $scope.day5EndTime = endTime;

                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;

                            if (timesheetDay.TPROG == 'FREE')
                            {
                              $scope.day5label = '';
                            }
                            else
                            {
                              $scope.day5label = 'to';
                            }
                   }

                   if (x == 5)
                   {
                    $scope.day6StartTime = startTime;
                    $scope.day6EndTime = endTime;

                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;

                            if (timesheetDay.TPROG == 'FREE')
                            {
                              $scope.day6label = '';
                            }
                            else
                            {
                              $scope.day6label = 'to';
                            }
                   }

                   if (x == 6)
                   {
                    $scope.day7StartTime = startTime;
                    $scope.day7EndTime = endTime;

                    $scope.lastDay = day;
                           if ($scope.firstDay == '')
                            $scope.firstDay = day;

                            if (timesheetDay.TPROG == 'FREE')
                            {
                              $scope.day7label = '';
                            }
                            else
                            {
                              $scope.day7label = 'to';
                            }
                   }

                  $scope.totalHoursScheduled =  parseFloat($scope.totalHoursScheduled.toFixed(2));

               }
            }

    }

    $scope.getWorkScheduleValue = function(requestedDate)
    {
     var timesheetLength = $rootScope.employeeData.TBL_WORK_SCHEDULE.length;
        for (var x=0; x<timesheetLength; x++)
             {
                 if ($rootScope.employeeData.TBL_WORK_SCHEDULE[x].DATUM == requestedDate)
                 {
                     return $rootScope.employeeData.TBL_WORK_SCHEDULE[x]; //parseFloat($rootScope.employeeData.TBL_TIMEOVERVIEW[x].REGULARHOURS +
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
            // we start at the current year
            var year = currentYear;
            months= 3; //number of months to show

            var calendarHTML = '';
            var dayOfWeek = 1;

            $scope.calendarArray.length = 0;

            var today = new Date(); //variable for today

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

              //first day of real calendar...
              firstDayDate = new Date(year,$scope.month,1);
              firstDay=firstDayDate.getDay();

              var priorMonthStyle = 'color:#8e8e8e';
              var nextMonthStyle = 'color:#8e8e8e';

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
                    if ((j >= firstDay + daysinMonth)) //from the next month
                    {
                      calendarHTML += '<span></span>';
                      //var daysForward = firstDay - j;
                      //var thisDate = addDays(firstDayDate, daysBack);
                      //var thisDay = thisDate.getDate();
                      //calendarHTML = calendarHTML +  '<span style="' + nextMonthStyle + '">' + thisDay + '</span>';
                      dayOfWeek += 1;
                    }
                    else if ((j < firstDay)) //from the prior month.
                    {
                      var daysBack = firstDay - j;
                      var thisDate = subtractDays(firstDayDate, daysBack);
                      var thisDay = thisDate.getDate();
                      calendarHTML = calendarHTML +  '<span style="' + priorMonthStyle + '">' + thisDay + '</span>';
                      dayOfWeek += 1;
                    }
                    else //regular day...
                    {
                        var thisDay = (j - firstDay + 1);

                        // check if a holiday
                        var thisDate = new Date(year,$scope.month,thisDay);

                        if (thisDate.toDateString() == today.toDateString()) //if we are on today, then populate the current week field to be used later to
                        // open the calendar for the current week.
                        {
                            $scope.currentWeek = weekRow.toString() + $scope.month.toString() + year.toString();
                            $scope.currentYear = year;
                            $scope.currentMonth = $scope.month;
                        }

                        // check for holidays
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

                        var holidayStyle = 'background-color:#FFFFCC;color:#000';
                        if (isHoliday)
                        {
                        calendarHTML = calendarHTML +  '<span style="' + holidayStyle + '">' + thisDay + '</span>';
                        }
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
                                  '<span>{{day1StartTime}}</span>' +
                                  '<span>{{day2StartTime}}</span>' +
                                  '<span>{{day3StartTime}}</span>' +
                                  '<span>{{day4StartTime}}</span>' +
                                  '<span>{{day5StartTime}}</span>' +
                                  '<span>{{day6StartTime}}</span>' +
                                  '<span>{{day7StartTime}}</span>' +
                                '</div>' +
                                '<div class="time-calendar-values time-calendar-values-scheduled">' +
                                  '<span><small>{{day1label}}</small> {{day1EndTime}}</span>' +
                                  '<span><small>{{day2label}}</small> {{day2EndTime}}</span>' +
                                  '<span><small>{{day3label}}</small> {{day3EndTime}}</span>' +
                                  '<span><small>{{day4label}}</small> {{day4EndTime}}</span>' +
                                  '<span><small>{{day5label}}</small> {{day5EndTime}}</span>' +
                                  '<span><small>{{day6label}}</small> {{day6EndTime}}</span>' +
                                  '<span><small>{{day7label}}</small> {{day7EndTime}}</span>' +
                                '</div>' +
                                /*'<div class="time-calendar-detail">' +
                                  '<h4 class="time-calendar-detail-heading">' + monthNames[$scope.month]+ ' {{firstDay}} - {{lastDay}}</h4>' +
                                  '<dl class="time-calendar-detail-text">' +
                                    '<dt>Scheduled</dt><dd>{{totalHoursScheduled}} hours</dd>' +
                                  '</dl>' +
                                '</div>' +*/
                              '</div>';

                    }
              }

              calendarHTML = calendarHTML +   '</div></div>';  //end of the month.
              $scope.month++; // go to next month.

              if ($scope.month>=12){ //go to next year
                $scope.month=0;
                year++;
              }
            }

        var $calendar = $('#calendar');
        $('#calendar').html(calendarHTML);
        $compile($calendar)($scope);
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
    $scope.month = 0;
    setDisplayedMonth(0);

    // open the work schedule to the current week.
    //$scope.toggleRow(weekRow, monthIn, yearIn);
    //$scope.toggleRow(122017,2,2017);
    $scope.toggleRow($scope.currentWeek, $scope.currentMonth, $scope.currentYear);
});
