import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommandeService } from '../../services/commande.service';
import { CommandeModel } from 'src/app/shared/models/commande.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-commande-add',
  templateUrl: './commande-add.component.html',
  styleUrls: ['./commande-add.component.scss']
})
export class CommandeAddComponent {
  selectedArticles: any[] = [];  // Liste des articles sélectionnés
  commandeForm: FormGroup;  // Formulaire pour la commande

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private commandeService: CommandeService,
    private toastr: ToastrService,  
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.selectedArticles = navigation?.extras?.state?.['articles'] || [];

    // Initialisation du formulaire avec FormBuilder
    this.commandeForm = this.fb.group({
     // numero: ['', Validators.required],
      date: ['', Validators.required],
      prixTotal: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Méthode pour enregistrer la commande
  enregistrerCommande() {
    if (this.commandeForm.valid && this.selectedArticles.length > 0) {
      console.log('Valeurs du formulaire:', this.commandeForm.value);

      const detailsCommande = this.selectedArticles.map(article => ({
        article: { id: article.id },
        fournisseur: { id: article.fournisseur?.id || 1 }, // par défaut si pas sélectionné
        nombre: article.nombre || 1,
        prixTotal: article.prixAchatUnitaire * (article.nombre || 1)
      }));
  
      const commande: CommandeModel = {
        //numero: this.commandeForm.value.numero,
        date: this.commandeForm.value.date,
        prixTotal: this.commandeForm.value.prixTotal,
        detailsCommande: detailsCommande,
        status: 'EN_COURS',
      };
        console.log(commande);
      this.commandeService.passerCommande(commande).subscribe({
        next: () => {
          this.toastr.success('Commande ajoutée avec succès !', 'Succès');
          this.router.navigate(['/gestion-article/listCommande']);
        },
        error: (error) => {
          console.error('Erreur backend', error);
          alert("Erreur lors de l'enregistrement de la commande.");
        }
      });
  
    } else {
      alert("Veuillez remplir tous les champs et sélectionner au moins un article.");
    }
  }
  
  private initForms(type: CommandeModel){
    if (type){
      this.commandeForm = this.fb.group({
        //numero: new FormControl(type.numero,[Validators.required]),
        date: new FormControl(type.date,[Validators.required]),
        prixTotal: new FormControl(type.prixTotal,[Validators.required]),
        
      })
    }
  }


  recalculerPrixTotal() {
    const total = this.selectedArticles.reduce((sum, article) => {
        const quantity = article.quantity || 1;  // Si la quantité est vide ou nulle, on la remplace par 1
        return sum + (article.prixAchatUnitaire * quantity);
    }, 0);
    
    // Mise à jour du prix total dans le formulaire
    this.commandeForm.patchValue({ prixTotal: total });
}


  ngOnInit() {
    this.recalculerPrixTotal();

    this.initForms(new CommandeModel());
    this.commandeForm = this.fb.group({
      //numero: ['', Validators.required],
      date: ['', Validators.required],
      prixTotal: ['', Validators.required],
    });

  }
  onSubmit() {
    if (this.commandeForm.invalid || this.selectedArticles.length === 0) {
      alert("Veuillez remplir le formulaire et sélectionner au moins un article.");
      return;
    }
  
    const commande: CommandeModel = {
      //numero: this.commandeForm.value.numero,
      date: this.commandeForm.value.date,
      prixTotal: this.commandeForm.value.prixTotal,
      status: 'EN_COURS',
      detailsCommande: this.selectedArticles.map(article => ({
        article: { id: article.id },
        fournisseur: { id: article.fournisseur.id }, 
        nombre: article.quantity || 1
      }))
    };
    
    
    
  
    this.commandeService.passerCommande(commande).subscribe({
      next: () => {
        alert("Commande ajoutée avec succès !");
        this.router.navigate(['/gestion-article/listCommande']);
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout de la commande :", err);
        alert("Une erreur est survenue lors de l'ajout.");
      }
    });
    
  }
  
  
  
}
