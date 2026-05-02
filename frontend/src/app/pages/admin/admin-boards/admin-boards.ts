import { Component } from '@angular/core';

interface AdminBoard {
  id: number;
  title: string;
  owner: string;
  notesCount: number;
  membersCount: number;
  backgroundTheme: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-boards',
  imports: [],
  templateUrl: './admin-boards.html',
  styleUrl: './admin-boards.css'
})
export class AdminBoards {
  boards: AdminBoard[] = [
    {
      id: 1,
      title: 'Proyecto Angular Final',
      owner: 'Daniel Slavulete',
      notesCount: 8,
      membersCount: 2,
      backgroundTheme: 'Azul',
      createdAt: '02/05/2026'
    },
    {
      id: 2,
      title: 'Diseño UI',
      owner: 'Daniel Slavulete',
      notesCount: 5,
      membersCount: 1,
      backgroundTheme: 'Morado',
      createdAt: '03/05/2026'
    },
    {
      id: 3,
      title: 'Backend Node.js',
      owner: 'Laura Pérez',
      notesCount: 11,
      membersCount: 3,
      backgroundTheme: 'Verde',
      createdAt: '04/05/2026'
    }
  ];
}