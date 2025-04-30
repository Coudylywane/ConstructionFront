import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommandeModel } from 'src/app/shared/models/commande.model';
import { CommandeService } from '../../services/commande.service';
Chart.register(...registerables); // Oblige Chart.js à charger tout ce qu’il faut


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  @ViewChild('lineChart') lineChartRef!: ElementRef;
  currentDateRange: string = '';
  commandes: CommandeModel[] = [];
  

  constructor(private commandeService: CommandeService) {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('fr-FR', options);

    this.currentDateRange = `📅 ${formattedDate}`;
    
  }

  ngAfterViewInit(): void {
    const ctx = this.lineChartRef.nativeElement.getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Commandes par mois',
          data: [15, 22, 30, 40, 35, 50],
          //borderColor: 'rgba(75, 192, 192, 1)',
          borderColor: '#996F05',
          backgroundColor: 'rgba(232, 116, 62, 0.22)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
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


   
  
    // Données pour le tableau des dernières commandes
    lastCommands = [
      { id: 1, number: 'C1234', date: new Date(), status: 'En cours', amount: 150 },
      { id: 2, number: 'C1235', date: new Date(), status: 'Validée', amount: 200 },
      { id: 3, number: 'C1236', date: new Date(), status: 'Annulée', amount: 120 }
    ];
  

    ngOnInit(): void {
      // Charger les données des statistiques et des commandes
      this.loadStats();
      this.loadCommands();
      this.recupererCommandes();

    }
  

    recupererCommandes() {
      this.commandeService.getCommandes().subscribe(data => {
        this.commandes = data; 
        console.log('Commandes récupérées:', this.commandes);
        this.genererStats(); 
      }, error => {
        console.error('Erreur de récupération des commandes', error);
      });
    }
  
    genererStats() {
      const enCours = this.commandes.filter(cmd => cmd.status === 'EN_COURS').length;
      const validees = this.commandes.filter(cmd => cmd.status === 'VALIDÉE').length;
      const annulees = this.commandes.filter(cmd => cmd.status === 'ANNULÉE').length;
  
      this.stats = [
        { icon: 'hourglass_top', title: 'Commandes en cours', value: enCours },
        { icon: 'check_circle', title: 'Commandes validées', value: validees },
        { icon: 'cancel', title: 'Commandes annulées', value: annulees }
      ];
    }
    
    // Fonction pour charger les statistiques (en cas de récupération via un service API)
    loadStats() {
      // Remplacez cette ligne par un appel réel à votre API pour récupérer les statistiques
      // Exemple: this.dashboardService.getStats().subscribe(data => { this.stats = data; });
      // Simuler des données dynamiques
      this.stats = [
        { icon: 'trending_up', title: 'Commandes en cours', value: 10 },
        { icon: 'check_circle', title: 'Commandes validées', value: 21 },
        { icon: 'cancel',title: 'Commandes annulées', value: 10 }
      ];
    }
  
    // Fonction pour charger les dernières commandes
    loadCommands() {
      // Remplacez cette ligne par un appel réel à votre API pour récupérer les commandes
      // Exemple: this.dashboardService.getLastCommands().subscribe(data => { this.lastCommands = data; });
      // Simuler des données dynamiques
      this.lastCommands = [
        { id: 1, number: 'C1234', date: new Date(), status: 'En cours', amount: 150000},
        { id: 2, number: 'C1235', date: new Date(), status: 'Validée', amount: 80000 },
        { id: 3, number: 'C1236', date: new Date(), status: 'Annulée', amount: 120000 }
      ];
    }
  
    // Méthode pour actualiser les données (en cas de besoin)
    refreshData() {
      // Cette fonction pourrait être utilisée pour actualiser les données
      this.loadStats();
      this.loadCommands();
    }
  

 
}
