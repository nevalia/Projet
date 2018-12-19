$(function(){
  
  // popover function bootstrap
  $('[data-toggle="popover"]').popover();

  // fin partie Adrien
  var countProductTotal = function() {
    var $table = $('.modal-body table')
    return $('tbody tr', $table).length;

  }
 // ajout dans le Panier
 // retirer du Panier
 // nombre d'unité
 // plusieur le meme éléments
 // ajout du prix et leur total

// fonction pour le calcul du total du panier
 var calculateBasketTotal = function() {
      // variable avec $ devant sont pour indiquer que ce sont des objets Jquery
      // Déclaration d'un objet jquerry dans une variable (reconnaissable au "$")
      // et mise en place d'un tableau ("table") par rapport au "body" du Modal
      // variable avec $ devant sont pour indiquer que ce sont des objets Jquery
      // faisant en sorte que "table" est l'enfant de modal-body
        var $table = $('.modal-body table')
      // Variable "sum" qui commence à 0
        var sum = 0;
        // Si la taille du tableau est égale à alors ...
        if ($table.length == 1) {
          // le tfoot se retire
            $('tfoot', $table).remove();
            // Pour chaque ligne du body du tableau ...
            $('tbody tr', $table).each(function( index ) {
              // on va cherché le prix
                var price = Number(parseFloat($(this).data('price')));
              // on va cherché l'id du produit
                var productId = $(this).data('productId');
              // on va cherché la quantité en s'assurant d'avoir un entier
                var amount = parseInt($('input[name="' + productId + '"]', $(this)).val());
              // On ajoute à "sum" le prix multiplié par la quantité
                sum += price * amount;
                sum = parseFloat(sum).toFixed(2);
            });
            // Création du tfoot dans une variable
            var $tfoot = $('<tfoot>');
            // Création d'une ligne dans la variable $tr
            var $tr = $('<tr>');
            // Dans une ligne, on met à la suite une colone ensuite l'attribut (qui fusionne
            // les 4 premières colones) puis on y écrit le texte
            $tr.append($('<td>').attr("colspan", 4).text('Total'));
            // Dans la ligne, ajout d'une colone où on y écrit la valeur totale
            $tr.append($('<td>').text(sum + ' €'));
            // Ajout d'une ligne dans le tfoot
            $tfoot.append($tr);
            // Ajout du tfoot dans le tableau
            $table.append($tfoot);
        }
        console.log(countProductTotal());
    }










    // lorsque l'on clique sur le bouton "ajouter au panier" déclenche la fonction event
    $('.add-to-basket').on('click', function(event) {
      $('#itemCount').text(countProductTotal());
    // On va chercher les parents du bouton "add-to-basket" par rapport à la classe card
    // puis on lui dit de ne pas accepter de valeurs négatives
      var $card = $(this).parents('.card').eq(0);
    // Variable qui va chercher l'image de la classe "card-image" par rapport à la variable card
      var $image = $('.card-image img', $card)
      // Clone l'image avec les propriétés définies dans le .css (redimenssionement de l'image)
          .clone().css({maxWidth: '40px', maxHeight: '40px'});
    // Variable qui va chercher le bouton de la class card-title button par rapport à la variable
    // card puis affiche le texte du bouton
      var title = $('.card-title button', $card).text();
    // Variable qui renvoie à la valeur de data-price de add-to-basket pour prendre le prix du jeu
      var price = $(this).data('price');
    // Variable qui renvoie à la valeur de data-productId de add-to-basket pour prendre la référence du jeu
    // data-product-id en Jquery donne productId (camel case)
      var productId = $(this).data('productId');

    // Variable qui va chercher le tableau du body...
      var $table = $('.modal-body table')
      // Si la taille est égale à 0 alors...
      if ($table.length == 0) {
        // Création tableau avec le .css défini à la suite
          $table = $('<table>')
              .css({
                  width: '100%',
                  border: '1px solid #000',
                  borderCollapse: 'collapse'
              })
              // .append($('<thead>')); pour ajouter un thead a ce niveau
              // Ajout d'un tbody à $table
              .append($('<tbody>'));
          // Ajout du tableau au body du modal
          $('.modal-body').append($table);
      }
      // Si l'ID du produit de la ligne du tableau renvoie false...
      if ($('tr[data-product-id="' + productId + '"]', $table).length == 0) {
        // il créer une nouvelle ligne...
          var $tr = $('<tr>')
          // propriétés css de la ligne
              .css({
                border: '1px solid #000'
              })
              // attribut qui attache l'ID du produit à la ligne
              .attr('data-product-id', productId)
              // attribut qui renvoie le prix du produit
              .attr('data-price', price);
          // Dans la ligne on créer une colonne image, puis une colone titre, puis une colone prix
          $tr.append($('<td>').append($image));
          $tr.append($('<td>').append($('<span>').text(title)));
          $tr.append($('<td>').append($('<span>').text((price) + ' €')));
          // Dans la ligne on créer une colone, puis un champ...
          $tr.append($('<td>').append(
              $('<input>')
                  // <input type="number" name="000000001" value="1"></input>
                  // On créer un type number qui n'accepte que les chiffres, puis un
                  // name qui renvoie à l'ID du produit, puis une valeur définit à 1
                  // de largeur 40px
                  .attr('type', 'number')
                  .attr('name', productId)
                  .attr('value', 1)
                  .css({
                      width: '60px'
                  })
                  // On ajoute une classe "product-amount"
                  .addClass('product-amount')
          ));
          // On créer une colone, puis un bouton qui servira à retirer les articles du panier
          // puis on rajoute une class "remove-from-basket"
          $tr.append($('<td>').append(
              $('<button>')
                  .html('<i class="fas fa-trash-alt"></i>')
                  .addClass('remove-from-basket')

          ));
          // Créer une ligne dans le body du tableau avec les données vues plus haut
          $('tbody', $table).append($tr);
          // sinon ...
      } else {
          // On vérifie la valeur de productId, puis on modifie la valeur de l'input en rajoutant +1
          var $input = $('input[name="' + productId + '"]', $table);
          $input.val(parseInt($input.val()) + 1);
      }
      // calcul du total du panier
      calculateBasketTotal();
    });

    // Lorsque l'on clique sur le bouton remove, on lance la fonction event...
    $(document).on('click', '.remove-from-basket', function(event) {
      $('#itemCount').text(countProductTotal());
      // On vérifie les lignes du document puis on supprime celle où l'ont à cliqué
      $(this).parents('tr').eq(0).remove();
      // Puis on recalcule le total
      calculateBasketTotal()
    });
    // Lorsque le nombre de produit change, on lance la fonction event qui recalcule le total
    $(document).on('change', '.product-amount', function(event) {
        calculateBasketTotal();
    });

// ///////////////////////////////////////////////// //
// /////////// Autres essais et versions /////////// //
// /////// Avec commentaires et explications /////// //
// ///////////////////////////////////////////////// //

  // $('.Abutton').on('click', function(event) {
  //   // ajoute dans le modal-body, le contenue dans le DOM de la condition
  //   // ne bind pas les éléments (comme les bouttons) dans le modal
  //   // .append() mettre à la suite (insertion d'élément spécifié comme le dernier enfant de chaque élément dans les données)
  //   // .parents() parents de ...
  //   // .eq(0) selecteur n'acceptant pas de valeurs négatives
  //   // .clone() recopie les valeurs demander, quitte a recopier tout un code html par exemple
  //     $('.modal-body').append($(this).parents('.card').eq(0).clone());
  //   });

  // $('.Abutton').on('click', function(event) {
  //   // recupere la carte correspondant au bouton
  //     var card = $(this).parents('.card').eq(0);
  //     // dans la "card" on récupère l'image
  //     var image = $('.card-image img', card).clone();
  //     // dans la "card" on récupère le title
  //     var title = $('.card-title button', card).html();
  //     // on les intègre dans le modal-body
  //     $('.modal-body').append(image);
  //     $('.modal-body').append(title);
  //   });

  // $('.Abutton').on('click', function(event) {
  //   // variable avec $ devant sont pour indiquer que ce sont des objets Jquery
  //       var $card = $(this).parents('.card').eq(0);
  //       // modfification de l'image par intégration a un nouveau css
  //       var $image = $('.card-image img', $card).clone().css({maxWidth: '20px', maxHeight: '20px'});
  //       var title = $('.card-title button', $card).html();
  //
  //       // création de tableau
  //       var $table = $('.modal-body table')
  //       if ($table.length = 0) {
  //           $table = $('<table>')
  //           $('.modal-body').append($table);
  //       }
  //       var $tr = $('<tr>');
  //       $tr.append($('<td>').append($image));
  //       $tr.append($('<td>').append(title));
  //       $('.modal-body').append($tr);
  //     });

  // $('.Abutton').on('click', function(event) {
  //      var $card = $(this).parents('.card').eq(0);
  //      var $image = $('.card-image img', $card).clone().css({maxWidth: '20px', maxHeight: '20px'});
  //      var title = $('.card-title button', $card).html();
  //
  //      var $table = $('.modal-body table')
  //      if ($table.length == 0) {
  //          $table = $('<table>')
  //          $('.modal-body').append($table);
  //      }
  //      var $tr = $('<tr>');
  //      $tr.append($('<td>').append($image));
  //      $tr.append($('<td>').append(title));
  //      // rajout du boutton "retirer du panier"
  //      $tr.append($('<td>').append(
  //          $('<button>')
  //              .html('X')
  //              .addClass('remove-from-basket')
  //      ));
  //      $table.append($tr);
  //    });
  //    // quand on click sur le "X" il supprime l'élément demander
  //    $(document).on('click', '.remove-from-basket', function(event) {
  //      $(this).parents('tr').eq(0).remove();
  //    });

  // $('.add-to-basket').on('click', function(event) {
  //       var $card = $(this).parents('.card').eq(0);
  //       var $image = $('.card-image img', $card)
  //           .clone()
  //           .css({
  //             maxWidth: '20px',
  //             maxHeight: '20px'
  //           });
  //       var title = $('.card-title button', $card).html();
  //       var price = $(this).data('price');
  //
  //       var $table = $('.modal-body table')
  //       if ($table.length == 0) {
  //           $table = $('<table>').css({
  //               width: '100%',
  //               border: '1px solid #000',
  //               borderCollapse: 'collapse'
  //           });
  //           $('.modal-body').append($table);
  //       }
  //       var $tr = $('<tr>').css({
  //           border: '1px solid #000'
  //       });
  //       $tr.append($('<td>').append($image));
  //       $tr.append($('<td>').append(title));
  //       $tr.append($('<td>').append(price));
  //       $tr.append($('<td>').append(
  //           $('<input>')
  //               .attr('type', 'text')
  //               .attr('size', '2')
  //       ));
  //       $tr.append($('<td>').append(
  //           $('<button>')
  //               .html('X')
  //               .addClass('remove-from-basket')
  //       ));
  //       $table.append($tr);
  //     });
  //
  //     $(document).on('click', '.remove-from-basket', function(event) {
  //       $(this).parents('tr').eq(0).remove();
  //     });

  // $('.add-to-basket').on('click', function(event) {
  //      var $card = $(this).parents('.card').eq(0);
  //      var $image = $('.card-image img', $card)
  //          .clone()
  //          .css({
  //            maxWidth: '20px',
  //            maxHeight: '20px'
  //          });
  //      var title = $('.card-title button', $card).html();
  //      var price = $(this).data('price');
  //      var productId = $(this).data('productId');
  //
  //      var $table = $('.modal-body table')
  //      if ($table.length == 0) {
  //          $table = $('<table>').css({
  //              width: '100%',
  //              border: '1px solid #000',
  //              borderCollapse: 'collapse'
  //          });
  //          $('.modal-body').append($table);
  //      }
  //      // data-product-id en Jquery donne productId (camel case)
  //      // le bouton envoi un identifiant produit
  //      // si le produit a le même identifiant alors il ajoute une valeur sinon il ajoute un ligne avec le nouveau produit
  //      if ($('tr[data-product-id="' + productId + '"]').length == 0) {
  //          // console.log('done');
  //          var $tr = $('<tr>').css({
  //              border: '1px solid #000'
  //          }).attr('data-product-id', productId);
  //          $tr.append($('<td>').append($image));
  //          $tr.append($('<td>').append($('<span>').html(title)));
  //          $tr.append($('<td>').append($('<span>').html(price + ' &euro;')));
  //          $tr.append($('<td>').append(
  //              $('<input>')
  //                  .attr('type', 'number')
  //                  .css({
  //                      width: '40px'
  //                  })
  //          ));
  //          $tr.append($('<td>').append(
  //              $('<button>')
  //                  .html('X')
  //                  .addClass('remove-from-basket')
  //          ));
  //          $table.append($tr);
  //      }
  //    });
  //
  //    $(document).on('click', '.remove-from-basket', function(event) {
  //      $(this).parents('tr').eq(0).remove();
  //    });







// ///////////////////////////////////////////////// //

});
