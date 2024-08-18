import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-card-stats',
  templateUrl: './card-stats.component.html',
  styleUrls: ['./card-stats.component.scss']
})
export class CardStatsComponent implements OnInit {

  studentsCount: number = 0;
  studentsApprovedCount: number = 0;
  studentsRegisteredCount: number = 0;

  constructor(private userService: UserService, private spinner: SpinnerService) { }

  fetchStudentsData(): void {
    this.spinner.showSpinner();
    this.userService.getStudentsCount().subscribe(
      (studentsCount: any) => {
        this.spinner.hideSpinner();
        this.studentsCount = studentsCount;
      },
      (error: any) => {
        this.spinner.hideSpinner();
        console.error('Error fetching studentsCount:', error);
      }
    );
    this.userService.getstudentsApprovedCount(2).subscribe(
      (studentsApprovedCount: any) => {
        this.spinner.hideSpinner();
        this.studentsApprovedCount = studentsApprovedCount;
      },
      (error: any) => {
        this.spinner.hideSpinner();
        console.error('Error fetching studentsApprovedCount:', error);
      }
    );
    this.userService.getstudentsApprovedCount(1).subscribe(
      (studentsRegisteredCount: any) => {
        this.spinner.hideSpinner();
        this.studentsRegisteredCount = studentsRegisteredCount;
      },
      (error: any) => {
        this.spinner.hideSpinner();
        console.error('Error fetching studentsRegisteredCount:', error);
      }
    );
  }

  ngOnInit(): void {
    this.fetchStudentsData()
  }

}
