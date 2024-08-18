import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActasAprobacionComponent } from './actas-aprob.component';


describe('ActasAprobacionComponent', () => {
  let component: ActasAprobacionComponent;
  let fixture: ComponentFixture<ActasAprobacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActasAprobacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActasAprobacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
