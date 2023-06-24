import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input()
  card: Card | undefined;

  @Input()
  showAttributeButtons = false;

  @Input()
  showAttributes = true; 

  @Output()
  attributeSelected = new EventEmitter<string>();

  selectAttribute(attribute: string) {
    this.attributeSelected.emit(attribute);
  }
}
