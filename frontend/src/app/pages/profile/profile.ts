import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  user = {
    name: 'Daniel Slavulete',
    email: 'daniel@test.com',
    role: 'USER',
    avatarUrl: '',
    nameColor: '#2563eb',
    nameBadge: 'Premium'
  };

  activePlans = [
    {
      name: 'Colores Premium',
      featureKey: 'PREMIUM_COLORS',
      purchasedAt: '02/05/2026'
    },
    {
      name: 'Background Themes',
      featureKey: 'BACKGROUND_THEMES',
      purchasedAt: '02/05/2026'
    }
  ];
}