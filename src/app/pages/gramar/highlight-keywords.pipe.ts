import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightKeywords',
})
export class HighlightKeywordsPipe implements PipeTransform {
  transform(paragraph: string, keywords: string[]): string {
    if (!paragraph || !keywords || keywords.length === 0) {
      return paragraph;
    }

    const regex = new RegExp(keywords.join('|'), 'gi');
    return paragraph.replace(regex, (match) => `<span style="text-decoration: underline; color: pink;">${match}</span>`);
  }
}
