import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  // Add the following code snippet to the app.component.ts file:
  protected readonly window = window;

    // protected readonly window = window;

}
