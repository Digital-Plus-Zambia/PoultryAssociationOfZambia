import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMemberShipPlan, ISession } from './IMembership';

declare const Stripe;

@Injectable({
  providedIn: 'root',
})
export class MembershipService {
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getMembership(): Observable<IMemberShipPlan> {
    return of({
      id: '',
      priceId: 'Dont forget to add your price id ',
      name: 'Awesome Membership Plan',
      price: '$9.00',
      features: [
        'Up to 5 users',
        'Basic support on Github',
        'Monthly updates',
        'Free cancelation',
      ],
    });
  }

  requestMemberSession(priceId: string): void {
    this.http
      .post<ISession>(this.baseUrl + 'api/payments/create-checkout-session', {
        priceId: priceId,
        successUrl: environment.successUrl,
        failureUrl: environment.cancelUrl,
      })
      .subscribe((session) => {
        this.redirectToCheckout(session);
      });
  }

  redirectToCheckout(session: ISession) {
    const stripe = Stripe(session.publicKey);

    stripe.redirectToCheckout({
      sessionId: session.sessionId,
    });
  }
}
