import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VocabularyComponent } from './vocabulary/vocabulary.component';
import { ComprehensionComponent } from './comprehension/comprehension.component';







const routes: Routes = [
    {
        path: "vocabulary",
        component: VocabularyComponent
    },
    {
        path: "comprehension",
        component: ComprehensionComponent
    },
    // {
    //     path: "arrivals",
    //     component: ArrivalsComponent
    // },
    // {
    //     path: "map",
    //     component: MapComponent
    // },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GramarRoutingModule { }
