import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterItem } from './footer-item';

describe('FooterItem', () => {
  let component: FooterItem;
  let fixture: ComponentFixture<FooterItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
