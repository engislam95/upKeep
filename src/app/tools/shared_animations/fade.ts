import { trigger, animate, transition, style } from '@angular/animations';

export const fade = [
  trigger('fade', [
    transition(
      //
      ':enter',
      [style({ transform: 'translateY(5%)', opacity: 0 }), animate('150ms', style({ transform: 'translateY(0)', opacity: 1 }))]
    ),
    transition(
      //
      ':leave',
      [style({ transform: 'translateY(0)', opacity: 1 }), animate('150ms', style({ transform: 'translateY(5%)', opacity: 0 }))]
    )
  ]),
  trigger('popupAnimation', [
    transition(
      //
      ':enter',
      // tslint:disable-next-line:max-line-length
      [style({ transform: 'translateY(-5%) translateX(50%)', opacity: 0 }), animate('150ms', style({ transform: 'translateY(0) translateX(50%)', opacity: 1 }))]
    ),
    transition(
      //
      ':leave',
      // tslint:disable-next-line:max-line-length
      [style({ transform: 'translateY(0) translateX(50%)', opacity: 1 }), animate('150ms', style({ transform: 'translateY(-5%) translateX(50%)', opacity: 0 }))]
    )
  ])
];
