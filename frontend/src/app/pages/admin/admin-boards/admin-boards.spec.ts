import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBoards } from './admin-boards';

describe('AdminBoards', () => {
  let component: AdminBoards;
  let fixture: ComponentFixture<AdminBoards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBoards],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBoards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
