import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = [
    { title: 'Commandes', value: 120, icon: 'inventory' },
    { title: 'Fournisseurs', value: 35, icon: 'local_shipping' },
    { title: 'Projets', value: 12, icon: 'engineering' },
  ];

  statusList = ['EN_COURS', 'VALIDEE', 'ANNULEE'];
  filter = {
    date: '',
    status: ''
  };

  chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'Commandes mensuelles',
        backgroundColor: '#0d6efd',
        data: [5, 10, 7, 12],
      }
    ]
  };
  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  ngOnInit(): void {}
}
