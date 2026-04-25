import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  ICanvasQaItem,
  ICanvasState,
  PitchStrategyCheckField,
  PitchStrategyTextField
} from '../models/canvas.model';
import { LocalStorageService } from '../services/local-storage.service';

const CANVAS_STORAGE_KEY = 'eduDash_canvasState';

@Injectable({
  providedIn: 'root'
})
export class CanvasStore {
  private localStorage = inject(LocalStorageService);

  private readonly defaultState: ICanvasState = {
    checklist: {
      jdItems: [
        {
          id: 'j1',
          text: 'Architect and maintain robust backend systems using .NET Core and C#.',
          checked: false
        },
        {
          id: 'j2',
          text: 'Demonstrable experience in designing, developing, debugging, and implementing .Net applications within AWS environments.',
          checked: false
        }
      ],
      resumeItems: [
        {
          id: 'r1',
          text: 'Improved enterprise module response performance by 30% using ASP.NET Core Web API and C#.',
          checked: false
        },
        {
          id: 'r2',
          text: 'Architected scalable Microservices using Dependency Injection, SOLID principles, and messaging queues.',
          checked: false
        }
      ]
    },
    pitchStrategy: {
      introChecked: false,
      aboutChecked: false,
      customChecked: false,
      introText: 'The following analysis presents an exhaustive interview preparation framework...',
      aboutText: 'Praveen Kashyap is a Full Stack Software Engineer with enterprise experience...',
      customTitle: 'Strategic Gap Analysis',
      customText: 'Identified three critical alignment vectors to bridge during the interview...'
    },
    qaItems: [
      {
        id: 'q1',
        q: 'Explain the different dependency injection lifetimes in .NET Core and when you would use each.',
        motive: 'Tests fundamental ASP.NET Core architectural knowledge and memory management.',
        hint: 'Define lifecycles: Transient (every time), Scoped (per request), Singleton (app lifetime).',
        a: 'For global caching, utilize AddSingleton. For per-request database context, AddScoped is mandatory. Never inject a Scoped service into a Singleton.',
        showHint: false,
        showAnswer: false,
        checked: false
      }
    ]
  };

  private state = signal<ICanvasState>(this.getInitialState());

  readonly canvasState = computed(() => this.state());
  readonly checklist = computed(() => this.state().checklist);
  readonly jdItems = computed(() => this.state().checklist.jdItems);
  readonly resumeItems = computed(() => this.state().checklist.resumeItems);
  readonly pitchStrategy = computed(() => this.state().pitchStrategy);
  readonly qaItems = computed(() => this.state().qaItems);

  constructor() {
    effect(() => {
      this.localStorage.setItem(CANVAS_STORAGE_KEY, this.state());
    });
  }

  toggleJdItem(id: string): void {
    this.state.update((state) => ({
      ...state,
      checklist: {
        ...state.checklist,
        jdItems: this.toggleChecklistItem(state.checklist.jdItems, id)
      }
    }));
  }

  toggleResumeItem(id: string): void {
    this.state.update((state) => ({
      ...state,
      checklist: {
        ...state.checklist,
        resumeItems: this.toggleChecklistItem(state.checklist.resumeItems, id)
      }
    }));
  }

  setPitchChecked(field: PitchStrategyCheckField, checked: boolean): void {
    this.state.update((state) => ({
      ...state,
      pitchStrategy: {
        ...state.pitchStrategy,
        [field]: checked
      }
    }));
  }

  updatePitchText(field: PitchStrategyTextField, text: string): void {
    this.state.update((state) => ({
      ...state,
      pitchStrategy: {
        ...state.pitchStrategy,
        [field]: text
      }
    }));
  }

  toggleQaHint(id: string): void {
    this.updateQaItem(id, (item) => ({ ...item, showHint: !item.showHint }));
  }

  toggleQaAnswer(id: string): void {
    this.updateQaItem(id, (item) => ({ ...item, showAnswer: !item.showAnswer }));
  }

  setQaChecked(id: string, checked: boolean): void {
    this.updateQaItem(id, (item) => ({ ...item, checked }));
  }

  toggleQaChecked(id: string): void {
    this.updateQaItem(id, (item) => ({ ...item, checked: !item.checked }));
  }

  addQa(item?: Partial<ICanvasQaItem>): void {
    const nextItem: ICanvasQaItem = {
      id: item?.id ?? crypto.randomUUID(),
      q: item?.q ?? 'New interview question',
      motive: item?.motive ?? 'Add why this question is likely to come up.',
      hint: item?.hint ?? 'Add a concise hint for your answer structure.',
      a: item?.a ?? 'Draft your polished answer here.',
      showHint: item?.showHint ?? false,
      showAnswer: item?.showAnswer ?? true,
      checked: item?.checked ?? false
    };

    this.state.update((state) => ({
      ...state,
      qaItems: [...state.qaItems, nextItem]
    }));
  }

  reset(): void {
    this.state.set(this.cloneState(this.defaultState));
  }

  private getInitialState(): ICanvasState {
    const savedState = this.localStorage.getItem<ICanvasState>(CANVAS_STORAGE_KEY);
    return this.normalizeState(savedState);
  }

  private normalizeState(savedState: ICanvasState | null): ICanvasState {
    if (!savedState) {
      return this.cloneState(this.defaultState);
    }

    return {
      checklist: {
        jdItems: savedState.checklist?.jdItems ?? this.defaultState.checklist.jdItems,
        resumeItems: savedState.checklist?.resumeItems ?? this.defaultState.checklist.resumeItems
      },
      pitchStrategy: {
        ...this.defaultState.pitchStrategy,
        ...savedState.pitchStrategy
      },
      qaItems: savedState.qaItems ?? this.defaultState.qaItems
    };
  }

  private toggleChecklistItem<T extends { id: string; checked: boolean }>(items: T[], id: string): T[] {
    return items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
  }

  private updateQaItem(id: string, update: (item: ICanvasQaItem) => ICanvasQaItem): void {
    this.state.update((state) => ({
      ...state,
      qaItems: state.qaItems.map((item) => item.id === id ? update(item) : item)
    }));
  }

  private cloneState(state: ICanvasState): ICanvasState {
    return structuredClone(state);
  }
}
