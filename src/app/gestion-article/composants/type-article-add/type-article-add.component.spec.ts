import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeArticleAddComponent } from './type-article-add.component';

describe('TypeArticleAddComponent', () => {
  let component: TypeArticleAddComponent;
  let fixture: ComponentFixture<TypeArticleAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeArticleAddComponent]
    });
    fixture = TestBed.createComponent(TypeArticleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
