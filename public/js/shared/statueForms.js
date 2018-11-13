// Flagging
const FLAGGED_CLASSNAME = 'flagged';
const UNFLAGGED_CLASSNAME = 'unflagged';
const FLAG_BUTTON_TEXT = 'Flag for review';
const UNFLAG_BUTTON_TEXT = 'Unflag';
const FLAG_TAG_TEXT = 'Flagged';
const FLAG_OPTION_CLASSNAME = 'flag-option';

// Private/public
const PRIVATE_CLASSNAME = 'private';
const PUBLIC_CLASSNAME = 'public';
const PUBLIC_BUTTON_TEXT = 'Set public';
const PRIVATE_BUTTON_TEXT = 'Set private';
const PRIVATE_TAG_TEXT = 'Private';
const VISIBLE_OPTION_CLASSNAME = 'visible-option';

(function() {
  $('.card-forms-container').on('submit', '.statue-form', function(ev) {
    ev.preventDefault();

    const $this = $(ev.target);
    const statueId = $this.find('input[name=statueId]').val();
    const $cardContainer = $this.parents('.card-container');
    let dataGroup = JSON.parse($cardContainer.attr('data-groups'));

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
          btnClassname = FLAG_OPTION_CLASSNAME;
          tagText = FLAG_TAG_TEXT;
          if (isFlagged) {
            btnText = UNFLAG_BUTTON_TEXT;
            btnClassnameBefore = UNFLAGGED_CLASSNAME;
            btnClassnameAfter = FLAGGED_CLASSNAME;
          } else {
            btnText = FLAG_BUTTON_TEXT;
            btnClassnameBefore = FLAGGED_CLASSNAME;
            btnClassnameAfter = UNFLAGGED_CLASSNAME;
          }
        } else {
          btnClassname = VISIBLE_OPTION_CLASSNAME;
          tagText = PRIVATE_TAG_TEXT;
          if (isPrivate) {
            btnText = PUBLIC_BUTTON_TEXT;
            btnClassnameBefore = PUBLIC_CLASSNAME;
            btnClassnameAfter = PRIVATE_CLASSNAME;
          } else {
            btnText = PRIVATE_BUTTON_TEXT;
            btnClassnameBefore = PRIVATE_CLASSNAME;
            btnClassnameAfter = PUBLIC_CLASSNAME;
          }
        }
        // toggle data group for Shuffle instances
        dataGroup = dataGroup.filter(group => group !== btnClassnameBefore);
        dataGroup.push(btnClassnameAfter);
        $cardContainer.attr('data-groups', `["${dataGroup.join('","')}"]`);
        
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
