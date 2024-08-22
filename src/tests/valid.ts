import { advancedSortOptionsForAngularTemplateStyle } from './configs/advanced-sort-options-for-angular-template-style';
import { createValidTestCase } from './create-test-case';

export const valid = [
    // Ignore excluded tag names
    createValidTestCase(
        { alphabetical: true },
        `<meta id="id" class="valid"/>`,
    ),
    createValidTestCase(
        {},
        `<h1 class="valid" id="id">Test</h1>`,
    ),
    // No error if alphabetical is false and attributes are not in order
    createValidTestCase(
        { alphabetical: false },
        `<h1 id="id" class="valid">Test</h1>`,
    ),
    // No error if alphabetical is true and attributes are in order
    createValidTestCase(
        { alphabetical: true },
        `<h1 class="valid" id="id">Test</h1>`,
    ),
    // Without attributes but with order
    createValidTestCase(
        {
            regexOrder: ['^first'],
        },
        `<h1 first-test="first" second="second">Test</h1>`,
    ),
    // With alphabetical order fallback
    createValidTestCase(
        {
            regexOrder: ['^first'],
            alphabetical: true,
        },
        `<h1 first-aa="should-be-first" first-bb="should-be-second" aria="first-of-defaults">Test</h1>`,
    ),

    // Advanced case that was causing issue because of AST result of ng-template
    createValidTestCase(
        advancedSortOptionsForAngularTemplateStyle,
        `<ng-template
    (overlayOutsideClick)="checkClick($event, wrapper, select)"
    [cdkConnectedOverlayHasBackdrop]="false"
    [cdkConnectedOverlayMinWidth]="250"
    [cdkConnectedOverlayOpen]="isFilterOpened"
    [cdkConnectedOverlayOrigin]="formfields"
    [cdkConnectedOverlayWidth]="wrapperWidth"
    cdkConnectedOverlay>
    <div></div>
</ng-template>`,
    ),
];
