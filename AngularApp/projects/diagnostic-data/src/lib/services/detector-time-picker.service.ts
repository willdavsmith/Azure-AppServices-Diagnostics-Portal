import { Injectable, Inject } from '@angular/core';
import * as momentNs from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { DIAGNOSTIC_DATA_CONFIG, DiagnosticDataConfig } from '../config/diagnostic-data-config';
import { BehaviorSubject } from 'rxjs';
const moment = momentNs;
@Injectable()
export class DetectorTimePickerService {

  readonly stringFormat: string = 'YYYY-MM-DD HH:mm';
  private allowedDurationInDays: number = 1;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, @Inject(DIAGNOSTIC_DATA_CONFIG) config: DiagnosticDataConfig) {
    this.allowedDurationInDays = config.isPublic ? 1 : 3;
  }

  private _startTime: momentNs.Moment;
  private _endTime: momentNs.Moment;

  // public update:BehaviorSubject<TimePickerInfo> = new BehaviorSubject<TimePickerInfo>(

  // );
  public detectorQueryParamsString:string = "";

  public getTimeDurationError(startTime: string, endTime: string): string {
    let errorMessage = "";

    let start = moment.utc(startTime);
    let end = moment.utc(endTime);

    //Use time picker component should always be valid date
    if (!start.isValid()) {
      errorMessage = 'Invalid Start date time specified. Expected format: MM/DD/YY hh:mm'
      return errorMessage;
    }
    if (!end.isValid()) {
      errorMessage = 'Invalid End date time specified. Expected format: MM/DD/YY hh:mm'
      return errorMessage;
    }
    if (moment.duration(moment.utc().diff(start)).asMinutes() < 30) {
      errorMessage = 'Start date time must be 30 minutes less than current date time';
      return errorMessage;
    }
    if (moment.duration(moment.utc().diff(end)).asMinutes() < 0) {
      errorMessage = 'End date time must be 15 minutes less than current date time';
      return errorMessage;
    }

    const diff: momentNs.Duration = moment.duration(end.diff(start));
    
    if (diff.asDays() <= -1) {
      errorMessage = 'Start date time should be greater than the End date time.';
      return errorMessage;
    }

    if (diff.asDays() > this.allowedDurationInDays) {
      errorMessage = `Difference between start and end date times should not be more than ${(this.allowedDurationInDays * 24).toString()} hours.`;
      return errorMessage;
    }

    if (moment.duration(moment.utc().diff(start)).asMonths() > 1) {
      errorMessage = 'Start date time cannot be more than a month from now.';
      return errorMessage;
    }

    if (diff.asMinutes() === 0) {
      errorMessage = 'Start and End date time cannot be the same.';
      return errorMessage;
    }

    if (diff.asMinutes() < 15) {
      errorMessage = 'Selected time duration must be at least 15 minutes.';
      return errorMessage;
    }

    return errorMessage;
  }

  public setCustomStartEnd(start:string,end:string):void {
    let startTime = moment.utc(start);
    let endTime:momentNs.Moment;
    if(moment.duration(moment.utc().diff(moment.utc(end))).asMinutes() < 16 ) {
      //The supplied end time > now - 15 minutes. Adjust the end time so that it becomes now()-15 minutes.
      endTime = moment.utc().subtract(16, 'minutes');
    }
    else {
      endTime = moment.utc(end);
    }

    if (this.getTimeDurationError(start,end) === '') {
      this._startTime = startTime;
      this._endTime = endTime;
    }
  }

  public navigateWithUpdatedTime():void {
    const routeParams = {
      'startTime': this._startTime.format('YYYY-MM-DDTHH:mm'),
      'endTime': this._endTime.format('YYYY-MM-DDTHH:mm')
    };
    if (this.detectorQueryParamsString != "") {
      routeParams['detectorQueryParams'] = this.detectorQueryParamsString;
    }
    if (this.activatedRoute.queryParams['searchTerm']) {
      routeParams['searchTerm'] = this.activatedRoute.snapshot.queryParams['searchTerm'];
    }
    this.router.navigate([], { queryParams: routeParams, relativeTo: this.activatedRoute });
  }

  private _refreshData() {

  }
}

interface TimePickerInfo {
  selectedKey: string,
  //if it is customized, then prefill with strart date and time
  startDate?: Date,
  endDate?: Date,
}