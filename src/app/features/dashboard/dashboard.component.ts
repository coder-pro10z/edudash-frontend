import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ActivityHeatmapComponent } from '../../shared/components/activity-heatmap/activity-heatmap.component';
import { RadarChartComponent } from './components/radar-chart/radar-chart.component';
import { StreakCounterComponent } from './components/streak-counter/streak-counter.component';
import { ContinueLearningComponent } from './components/continue-learning/continue-learning.component';
import { IStatCard } from '../../core/models/stat-card.model';
import { IHeatmapConfig } from '../../core/models/heatmap.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    StatCardComponent, 
    ActivityHeatmapComponent,
    RadarChartComponent,
    StreakCounterComponent,
    ContinueLearningComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Stat Card Data (hardcoded for now, will be replaced by Agent Gamma with API)
  questionsStat: IStatCard = {
    icon: 'check-circle',
    iconColor: 'text-[#34A853]',
    iconBg: 'bg-[#34A85315]',
    value: '142',
    label: 'Questions Solved',
    footer: '12 questions to next milestone'
  };

  topicsStat: IStatCard = {
    icon: 'book-open',
    iconColor: 'text-[#1A73E8]',
    iconBg: 'bg-[#1A73E815]',
    value: '8 / 45',
    label: 'Topics Mastered',
    footer: 'Next: Dynamic Programming'
  };

  accuracyStat: IStatCard = {
    icon: 'target',
    iconColor: 'text-[#9C27B0]',
    iconBg: 'bg-[#9C27B015]',
    value: '87%',
    label: 'Accuracy Rate',
    footer: '+2% this week'
  };

  // Heatmap Data
  heatmapConfig: IHeatmapConfig = {
    data: {}, // Gamma will populate
    layout: 'vertical',
    shape: 'circle'
  };

  changeHeatmapLayout(layout: 'vertical' | 'horizontal') {
    this.heatmapConfig = { ...this.heatmapConfig, layout };
  }

  changeHeatmapShape(shape: 'square' | 'circle') {
    this.heatmapConfig = { ...this.heatmapConfig, shape };
  }
}
