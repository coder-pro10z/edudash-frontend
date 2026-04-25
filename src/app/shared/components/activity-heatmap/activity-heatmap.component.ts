import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Activity, Flame, ChevronRight, TrendingUp } from 'lucide-angular';
import { IHeatmapConfig, IHeatmapCell } from '../../../core/models/heatmap.model';

@Component({
  selector: 'app-activity-heatmap',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './activity-heatmap.component.html',
  styleUrl: './activity-heatmap.component.scss'
})
export class ActivityHeatmapComponent implements OnInit {
  @Input({ required: true }) config!: IHeatmapConfig;
  
  cells: IHeatmapCell[] = [];
  months: string[] = [];

  ngOnInit() {
    this.generateHeatmapData();
  }

  private generateHeatmapData() {
    // Basic stub logic for visual layout. Real logic will use this.config.data.
    const today = new Date();
    const days = 140; // Approx 20 weeks * 7 days
    
    // Generate simple month headers
    this.months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dateString = date.toISOString().split('T')[0];
      const count = this.config.data[dateString] || 0;
      
      this.cells.push({
        date: date,
        count: count,
        isFuture: false,
        color: this.getColor(count)
      });
    }
  }

  private getColor(count: number): string {
    if (count === 0) return 'bg-[#F8F9FA] border-[#E0E0E0]';
    if (count < 3) return 'bg-[#1A73E8]/20 border-[#1A73E8]/10';
    if (count < 6) return 'bg-[#1A73E8]/50 border-[#1A73E8]/20';
    if (count < 10) return 'bg-[#1A73E8]/80 border-[#1A73E8]/30';
    return 'bg-[#1A73E8] border-[#1A73E8]/50';
  }
}
