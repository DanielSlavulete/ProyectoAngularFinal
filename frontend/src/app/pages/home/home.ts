import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Board {
  id: number;
  title: string;
  description: string;
  color: string;
  backgroundTheme: string;
  notesCount: number;
  updatedAt: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  boards: Board[] = [
    {
      id: 1,
      title: 'Proyecto Angular Final',
      description: 'Tablero principal para organizar frontend, backend y base de datos.',
      color: '#2563eb',
      backgroundTheme: 'Azul',
      notesCount: 8,
      updatedAt: 'Hoy'
    },
    {
      id: 2,
      title: 'Diseño UI',
      description: 'Ideas para pantallas, componentes, colores y estilos.',
      color: '#7c3aed',
      backgroundTheme: 'Morado',
      notesCount: 5,
      updatedAt: 'Ayer'
    },
    {
      id: 3,
      title: 'Backend Node.js',
      description: 'Endpoints, Prisma, JWT, validaciones y lógica de pedidos.',
      color: '#059669',
      backgroundTheme: 'Verde',
      notesCount: 11,
      updatedAt: 'Hace 3 días'
    }
  ];
}