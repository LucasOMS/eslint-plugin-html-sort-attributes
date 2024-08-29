import { advancedSortOptionsForAngularTemplateStyle } from './configs/advanced-sort-options-for-angular-template-style';
import { createInvalidTestCase } from './create-test-case';

export const invalid = [
    // Wrong order at first
    createInvalidTestCase(
        { alphabetical: true },
        `<h1 id="id" class="invalid" data="data">Test</h1>`,
        `<h1 class="invalid" data="data" id="id">Test</h1>`,
        {
            type: 'alphabetical',
            attributeInError: 'class',
            // No regex matched because none configured
            attributeInErrorMatchedRegex: undefined,
        }),
    // Wrong order at middle
    createInvalidTestCase(
        { alphabetical: true },
        `<h1 class="valid" id="id" data="data">Test</h1>`,
        `<h1 class="valid" data="data" id="id">Test</h1>`,
        {
            type: 'alphabetical',
            attributeInError: 'data',
            // No regex matched because none configured
            attributeInErrorMatchedRegex: undefined,
        }),
    // Wrong order at end
    createInvalidTestCase(
        { alphabetical: true },
        `<h1 data="data" id="id" class="valid">Test</h1>`,
        `<h1 class="valid" data="data" id="id">Test</h1>`,
        {
            type: 'alphabetical',
            attributeInError: 'class',
            // No regex matched because none configured
            attributeInErrorMatchedRegex: undefined,
        }),
    createInvalidTestCase(
        { regexOrder: ['^first'] },
        `<h1 second="second" first-test="first">Test</h1>`,
        `<h1 first-test="first" second="second">Test</h1>`,
        {
            type: 'order',
            attributeInError: 'first-test',
            attributeInErrorMatchedRegex: '^first',
            previousAttributeMatchedRegex: undefined, // Matched none
        }),
    createInvalidTestCase(
        { regexOrder: ['^z', '^first'] },
        `<h1 first-test="first" second="second" z-attr="first">Test</h1>`,
        `<h1 z-attr="first" first-test="first" second="second">Test</h1>`,
        {
            type: 'order',
            attributeInError: 'z-attr',
            attributeInErrorMatchedRegex: '^z',
            previousAttributeMatchedRegex: undefined, // Matched none
        },
    ),
    // With alphabetical order fallback
    createInvalidTestCase(
        {
            regexOrder: ['^first'],
            alphabetical: true,
        },
        `<h1 first-bb="should-be-second" first-aa="should-be-first">Test</h1>`,
        `<h1 first-aa="should-be-first" first-bb="should-be-second">Test</h1>`,
        {
            type: 'alphabetical',
            attributeInError: 'first-aa',
            attributeInErrorMatchedRegex: '^first',
        }),
    // Test fix when multiline and tag on same line as first attribute
    createInvalidTestCase(
        {
            regexOrder: ['^first'],
            alphabetical: true,
        },
        `<h1 first-bb="should-be-second"
    first-aa="should-be-first">Test</h1>`,
        `<h1 first-aa="should-be-first"
    first-bb="should-be-second">Test</h1>`,
        {
            type: 'alphabetical',
            attributeInError: 'first-aa',
            attributeInErrorMatchedRegex: '^first',
        }),
    // Test fix when multiline and tag NOT on same line as first attribute
    createInvalidTestCase(
        advancedSortOptionsForAngularTemplateStyle,
        `<h1 class="valid" *structuralDirective #template [input]="test" [style.color]="color" (output)="onOutput()" [@animationWithState]="state" @animation>Test</h1>`,
        `<h1 #template *structuralDirective (output)="onOutput()" [input]="test" [@animationWithState]="state" @animation class="valid" [style.color]="color">Test</h1>`,
        {
            type: 'order',
            attributeInError: '*structuralDirective',
            attributeInErrorMatchedRegex: '^\\*.*$',
            previousAttributeMatchedRegex: '^class$',
        }),
    createInvalidTestCase(
        {
            regexOrder: ['^first'],
            alphabetical: true,
        },
        `<h1
        first-bb="should-be-second" 
        first-aa="should-be-first">Test</h1>`,
        `<h1
        first-aa="should-be-first"
        first-bb="should-be-second">Test</h1>`,
        {
            type: 'alphabetical',
            attributeInError: 'first-aa',
            attributeInErrorMatchedRegex: '^first',
        }),
    // Test fix with self closing tag
    createInvalidTestCase(
        advancedSortOptionsForAngularTemplateStyle,
        `<app-component class="valid" *structuralDirective />`,
        `<app-component *structuralDirective class="valid" />`,
        {
            type: 'order',
            attributeInError: '*structuralDirective',
            attributeInErrorMatchedRegex: '^\\*.*$',
            previousAttributeMatchedRegex: '^class$',
        }),
    // Test fix with multiline self closing tag and tag on same line as first attribute
    createInvalidTestCase(
        advancedSortOptionsForAngularTemplateStyle,
        `<app-component class="valid"
               #reference />`,
        `<app-component #reference
               class="valid" />`,
        {
            type: 'order',
            attributeInError: '#reference',
            attributeInErrorMatchedRegex: '^\\#.*$',
            previousAttributeMatchedRegex: '^class$',
        }),
    // Test fix with multiline self closing tag and tag on same line as first attribute
    createInvalidTestCase(
        advancedSortOptionsForAngularTemplateStyle,
        `<app-component class="valid"
               *structuralDirective />`,
        `<app-component *structuralDirective
               class="valid" />`,
        {
            type: 'order',
            attributeInError: '*structuralDirective',
            attributeInErrorMatchedRegex: '^\\*.*$',
            previousAttributeMatchedRegex: '^class$',
        }),
    createInvalidTestCase(
        advancedSortOptionsForAngularTemplateStyle,
        `<app-component class="valid"
               *ngFor="let item of items" />`,
        `<app-component *ngFor="let item of items"
               class="valid" />`,
        {
            type: 'order',
            attributeInError: '*ngFor',
            attributeInErrorMatchedRegex: '^\\*.*$',
            previousAttributeMatchedRegex: '^class$',
        }),
    // Very specific example to fix an issue with the fixer
    createInvalidTestCase(
        advancedSortOptionsForAngularTemplateStyle,
        `<div
    (fileDropped)="drop($event)"
    appFileDragNDrop
    class="droppable-image d-flex justify-content-center align-items-center"
    [class.has-image]="displayPreviewSteps.includes(step)"
    [style.height.px]="previewHeight">
    <label
        *ngIf="droppable"
        [matTooltipDisabled]="loading"
        [matTooltip]="clickOrDropMessage | translate | uppercase"
        class="d-flex justify-content-center align-items-center"
        for="file">
        <ng-container *ngIf="!loading; else loadingTemplate">
            <span *ngIf="!displayPreviewSteps.includes(step)">{{ clickOrDropMessage | translate | uppercase }}</span>
            <img
                *ngIf="displayPreviewSteps.includes(step)"
                [alt]="temporaryName"
                [src]="step === stepEnum.NEW ? filePath : upload.fullPath" />
        </ng-container>
    </label>
    <input
        #file
        (change)="fileChange($event.target['files'])"
        [accept]="acceptMimes"
        hidden
        id="file"
        onclick="this.value=null"
        type="file" />
    <div *ngIf="progress > 0" class="progress-overlay" [style.width.%]="progress"></div>
</div>`,
        `<div
    (fileDropped)="drop($event)"
    appFileDragNDrop
    class="droppable-image d-flex justify-content-center align-items-center"
    [class.has-image]="displayPreviewSteps.includes(step)"
    [style.height.px]="previewHeight">
    <label
        *ngIf="droppable"
        [matTooltip]="clickOrDropMessage | translate | uppercase"
        [matTooltipDisabled]="loading"
        for="file"
        class="d-flex justify-content-center align-items-center">
        <ng-container *ngIf="!loading; else loadingTemplate">
            <span *ngIf="!displayPreviewSteps.includes(step)">{{ clickOrDropMessage | translate | uppercase }}</span>
            <img
                *ngIf="displayPreviewSteps.includes(step)"
                [alt]="temporaryName"
                [src]="step === stepEnum.NEW ? filePath : upload.fullPath" />
        </ng-container>
    </label>
    <input
        #file
        (change)="fileChange($event.target['files'])"
        [accept]="acceptMimes"
        hidden
        id="file"
        onclick="this.value=null"
        type="file" />
    <div *ngIf="progress > 0" class="progress-overlay" [style.width.%]="progress"></div>
</div>`,
        {
            type: 'alphabetical',
            attributeInError: '[matTooltip]',
            attributeInErrorMatchedRegex: '^\\[.*\\]$',
        }),
    createInvalidTestCase(
        advancedSortOptionsForAngularTemplateStyle,
        `<app-global-sort
        [dataSource]="supplierStructureDataSource"
        [columnTranslationKeys]="{
            'supplier.name': 'suppliers.home.table.name',
            'supplier.address.zipCode': 'suppliers.home.table.zipCode' + '\n',
            'supplier.address.city': 'suppliers.home.table.city',
            'contact.firstName': 'suppliers.home.table.contact',
            notes: 'suppliers.home.table.notes',
            updatedAt: 'global.dateOfModification'
        }"/>`,
        `<app-global-sort
        [columnTranslationKeys]="{
            'supplier.name': 'suppliers.home.table.name',
            'supplier.address.zipCode': 'suppliers.home.table.zipCode' + '\n',
            'supplier.address.city': 'suppliers.home.table.city',
            'contact.firstName': 'suppliers.home.table.contact',
            notes: 'suppliers.home.table.notes',
            updatedAt: 'global.dateOfModification'
        }"
        [dataSource]="supplierStructureDataSource"/>`,
        {
            type: 'alphabetical',
            attributeInError: '[columnTranslationKeys]',
            attributeInErrorMatchedRegex: '^\\[.*\\]$',
        }),

    // Test source location error when line is indented
    createInvalidTestCase(
        advancedSortOptionsForAngularTemplateStyle,
        `    <app-icon-button icon="no-speaker" (action)="ungroup()" state="active"/>`,
        `    <app-icon-button (action)="ungroup()" icon="no-speaker" state="active"/>`,
        {
            type: 'order',
            attributeInError: '(action)',
            attributeInErrorMatchedRegex: '^\\(.*\\)$',
            previousAttributeMatchedRegex: '^(?!class|style|\\[class|\\[style|\\[ngClass|\\[ngStyle).*$',
        },
    ),
    // Test source location error after some new lines
    createInvalidTestCase(
        advancedSortOptionsForAngularTemplateStyle,
        `<div>
    
    <app-icon-button icon="no-speaker" (action)="ungroup()" state="active"/>
</div>`,
        `<div>
    
    <app-icon-button (action)="ungroup()" icon="no-speaker" state="active"/>
</div>`,
        {
            type: 'order',
            attributeInError: '(action)',
            attributeInErrorMatchedRegex: '^\\(.*\\)$',
            previousAttributeMatchedRegex: '^(?!class|style|\\[class|\\[style|\\[ngClass|\\[ngStyle).*$',
        },
    ),

    // Test fix with specific indentation breaking
    createInvalidTestCase(
        advancedSortOptionsForAngularTemplateStyle,
        `<div>
    <button class="p-2 text-white hover:bg-primary-950 dark:hover:bg-dark-700"
            routerLink="/rooms"
            type="button">
        Pièces
    </button>
</div>`,
        `<div>
    <button routerLink="/rooms"
            type="button"
            class="p-2 text-white hover:bg-primary-950 dark:hover:bg-dark-700">
        Pièces
    </button>
</div>`,
        {
            type: 'order',
            attributeInError: 'routerLink',
            attributeInErrorMatchedRegex: '^(?!class|style|\\[class|\\[style|\\[ngClass|\\[ngStyle).*$',
            previousAttributeMatchedRegex: '^class$',
        }),
];
