import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./managemycar/managecar.module').then(m => m.ManageCar)
  },
  {
    path: 'managecar', loadChildren: () => import('./managemycar/managecar.module').then(m => m.ManageCar)
  },

  
  {
    path: 'school', loadChildren: () => import('./school/school.module').then(m => m.SchoolModule)
  },
  {
    path: 'addressbook', loadChildren: () => import('./address-book/book.module').then(m => m.BookModule)
  },
  {
    path: 'Gramar', loadChildren: () => import('./gramar/gramar.module').then(m => m.GramarModule)
  },
  {
    path: 'van', loadChildren: () => import('./van/van.module').then(m => m.vanModule)
  },

  {
    path: 'kgsheet', loadChildren: () => import('./kgsheet/kgsheet.module').then(m => m.KgModule)
  },
 
 
  {
    path: 'learning', loadChildren: () => import('./learning/learning.module').then(m => m.LearningModule)
  },

 
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
