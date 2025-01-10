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

export const TimeframeTradingViewIntervalMap: {
  [key: string]: number | string;
} = {
  M1: 1,
  M5: 5,
  M15: 15,
  M30: 30,
  H1: 60,
  H4: 240,
  D: 'D',
  W: 'W',
  M: 'M',
};

export function sortDataByInsertedAt(res: any[]) {
  return res.sort(
    (a, b) => Date.parse(b.inserted_at) - Date.parse(a.inserted_at),
  );
}

//navigate to external domain opening new tab
export function gotoExternalDomain(domain: string) {
  (window as any).open(domain, '_blank');
}
