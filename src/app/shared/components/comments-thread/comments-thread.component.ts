import { Component } from '@angular/core';

@Component({
  selector: 'comments-thread',
  templateUrl: './comments-thread.component.html',
})
export class CommentsThreadComponent {
  //Failed POC to set initial scroll
  /* @ViewChild('main_container') private main_container!: ElementRef;

  ngAfterViewChecked() {
    this.main_container.nativeElement.scrollTop -= 20;
  }

  onNextSearchPosition() {
    this.main_container.nativeElement.scrollTop -= 20;
  } */

  comment1 = {
    insertedAt: new Date('2024-03-01'),
    offline: false,
    text: 'Es un hecho establecido hace demasiado tiempo que un lector se distraerá con el contenido del texto de un sitio mientras que mira su diseño. El punto de usar Lorem Ipsum es que tiene una distribución más o menos normal de las letras, al contrario de usar textos como por ejemplo "Contenido aquí, contenido aquí". Estos textos hacen parecerlo un español que se puede leer. Muchos paquetes de autoedición y editores de páginas web usan el Lorem Ipsum como su texto por defecto, y al hacer una búsqueda de "Lorem Ipsum" va a dar por resultado muchos sitios web que usan este texto si se encuentran en estado de desarrollo. Muchas versiones han evolucionado a través de los años, algunas veces por accidente, otras veces a propósito (por ejemplo insertándole humor y cosas por el estilo).',
  };
  comment2 = {
    insertedAt: new Date('2025-02-01'),
    offline: false,
    text: 'hola putitooooooo',
  };
  comment3 = {
    insertedAt: new Date('2025-03-01'),
    offline: false,
    text: 'hola putitooooooo',
  };
  comment4 = {
    insertedAt: new Date('2025-04-01'),
    offline: false,
    text: 'hola putitooooooo',
  };
  comments = [this.comment1, this.comment2, this.comment3, this.comment4];
}
