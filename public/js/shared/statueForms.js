(function() {
  $('.card-forms-container').on('submit', '.statue-form', function(ev) {
    ev.preventDefault();

    const $this = $(ev.target);
    const statueId = $this.find('input[name=statueId]').val();
    const isFlagForm = $this.hasClass('flag-form');
    const formData = { statueId: statueId };
    let $formInput;
    if (isFlagForm) {
      $formInput = $this.find('input[name=isFlagged]');
      formData['isFlagged'] = $formInput.val();
    } else {
      $formInput = $this.find('input[name=isPrivate]');
      formData['isPrivate'] = $formInput.val();
    }
    $.ajax({
      url: $this.attr('action'),
      method: 'POST',
      data: formData,
      success: function(data) {
        const $statueCard = $('#statue' + statueId);
        let $tagContainer = $statueCard.find('.tag-container');
        const isFlagged = data.isFlagged;
        const isPrivate = data.isPrivate;
        let btnClassnameBefore, btnClassnameAfter, tagText, btnText;
        if (!$tagContainer.length) {
          $tagContainer = $('<div class="tag-container"></div>');
          $statueCard.find('.card-body').prepend($tagContainer);
        }

        if (isFlagForm) {
          btnClassname = 'flag-option';
          tagText = 'Flagged';
          if (isFlagged) {
            btnText = 'Unflag';
            btnClassnameBefore = 'unflag';
            btnClassnameAfter = 'flag';
          } else {
            btnText = 'Flag for review';
            btnClassnameBefore = 'flag';
            btnClassnameAfter = 'unflag';
          }
        } else {
          btnClassname = 'visible-option';
          tagText = 'Private';
          if (isPrivate) {
            btnText = 'Set public';
            btnClassnameBefore = 'public';
            btnClassnameAfter = 'private';
          } else {
            btnText = 'Set private';
            btnClassnameBefore = 'private';
            btnClassnameAfter = 'public';
          }
        }
        
        $formInput.val(true);
        if (isFlagged) {
          $tagContainer.append(`<span class="${btnClassname} ${btnClassnameAfter}">${tagText}</span>`);
        } else if (isPrivate) {
          $tagContainer.prepend(`<span class="${btnClassname} ${btnClassnameAfter}">${tagText}</span>`);
        } else {
          $formInput.val(false);
        }

        if ((isFlagged !== undefined && !isFlagged) || (isPrivate !== undefined && !isPrivate)) {
          $tagContainer.find(`.${btnClassname}`).remove();
        }
        if (!$tagContainer.find('span').length) {
          $tagContainer.remove();
        }
        $statueCard.find(`.btn.${btnClassname}`)
          .removeClass(btnClassnameBefore)
          .addClass(btnClassnameAfter)
          .text(btnText);
      },
      error: function(xhr) {
      }
    });
  });

  $('#map').on('submit', '.statue-remove-form', function(ev) {
    ev.preventDefault();
    let errMsg = 'Are you sure that you want to delete statue?: \n\n' + ev.target.dataset['statueName'];
    if (confirm(errMsg)) {
      const $this = $(ev.target);
      const statueId = $this.find('input[name=statueId]').val();
      $.ajax({
        url: $this.attr('action'),
        method: 'POST',
        data: {
          statueId: statueId
        },
        success: function(data) {
          location.reload();
        },
        error: function(xhr) {
        }
      });
    }
  });
})();
