import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedLinksComponent } from './created-links.component';

describe('CreatedLinksComponent', () => {
  let component: CreatedLinksComponent;
  let fixture: ComponentFixture<CreatedLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedLinksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
