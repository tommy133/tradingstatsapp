import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

export function formatDate(inputDate: string): string {
  return inputDate.split('T')[0];
}

export function navigatePreservingQueryParams(
  commands: any[],
  router: Router,
  activatedRoute: ActivatedRoute,
): void {
  router.navigate(commands, {
    relativeTo: activatedRoute,
    queryParams: activatedRoute.snapshot.queryParams,
    queryParamsHandling: 'preserve',
  });
}

export function getStatusColorClass(status: number) {
  switch (status) {
    case 1:
      return 'text-blue-300';
    case 3:
      return 'text-orange-600';
    default:
      return '';
  }
}

export function textToHyperlink(
  textEntry: HTMLTextAreaElement,
  textFormControl?: FormControl,
  path?: string,
): void {
  let textSelected: string;
  let selectionPrefix: string;
  let selectionSuffix: string;

  const selectionStart = textEntry.selectionStart;
  const selectionEnd = textEntry.selectionEnd;

  if (selectionStart !== undefined && selectionEnd !== undefined) {
    textSelected = textEntry.value.substring(selectionStart, selectionEnd);
    selectionPrefix = textEntry.value.substring(0, selectionStart);
    selectionSuffix = textEntry.value.substring(
      selectionEnd,
      textEntry.value.length,
    );
    textEntry.value = `${selectionPrefix}<a href="${path}/${textSelected}">${textSelected}</a>${selectionSuffix}`;
  } else {
    // Handle cases where selection is not defined, for compatibility with older browsers
    // (Generally, this block may not be necessary for modern web applications)
    textEntry.focus();
    const sel = (document as any).selection.createRange();
    textSelected = sel.text;
    textEntry.value = textEntry.value.replace(
      textSelected,
      `<a href="${path}/${textSelected}">${textSelected}</a>`,
    );
  }
  textFormControl?.setValue(textEntry.value);
}
