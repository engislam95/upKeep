import { transition, trigger, query, style, animate, animateChild, keyframes } from '@angular/animations';
export const popup = [
  trigger(
    'parentAnimation', //
    [
      //
      transition(
        //
        ':enter',
        [
          style(
            //
            { opacity: 0 }
          ),
          animate('150ms', style({ opacity: 1 })),
          query('@childAnimation', [animateChild()])
        ]
      ),
      transition(
        //
        ':leave',
        [
          query('@childAnimation', [animateChild()]),
          style(
            //
            { transform: 'translateY(0)', opacity: 1 }
          ),
          animate('150ms', style({ opacity: 0 }))
        ]
      )
    ]
  ),
  trigger('childAnimation', [
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
  ])
];
