import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeAddComponent } from './commande-add.component';

describe('CommandeAddComponent', () => {
  let component: CommandeAddComponent;
  let fixture: ComponentFixture<CommandeAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandeAddComponent]
    });
    fixture = TestBed.createComponent(CommandeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
