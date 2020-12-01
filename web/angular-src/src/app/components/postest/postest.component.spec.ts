import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostestComponent } from './postest.component';

describe('PostestComponent', () => {
  let component: PostestComponent;
  let fixture: ComponentFixture<PostestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
