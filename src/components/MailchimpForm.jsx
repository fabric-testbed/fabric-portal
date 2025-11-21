import React from 'react';

const MailchimpForm = () => {
  const html = `
    <div id="mc_embed_signup">
    <form action="https://renci.us22.list-manage.com/subscribe/post?u=473f2c587d0f8de123a54df78&amp;id=622423558b&amp;f_id=00efc2e1f0"
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            class="validate"
            target="_blank"
            novalidate>
        <div id="mc_embed_signup_scroll">
        <div class="mc-field-group">
            <label for="mce-EMAIL">Email Address <span class="asterisk">*</span></label>
            <input type="email" name="EMAIL" class="required email" id="mce-EMAIL" required value="">
        </div>

        <div class="mc-field-group">
            <label for="mce-FNAME">First Name </label>
            <input type="text" name="FNAME" class="text" id="mce-FNAME" value="">
        </div>

        <div class="mc-field-group">
            <label for="mce-LNAME">Last Name </label>
            <input type="text" name="LNAME" class="text" id="mce-LNAME" value="">
        </div>

        <div class="mc-field-group">
            <label for="mce-MMERGE5">Organization/ Institution </label>
            <input type="text" name="MMERGE5" class="text" id="mce-MMERGE5" value="">
        </div>

        <div class="mc-field-group">
            <label for="mce-MMERGE8">Industry </label>
            <input type="text" name="MMERGE8" class="text" id="mce-MMERGE8" value="">
        </div>

        <div class="mc-field-group">
            <label for="mce-MMERGE4">Anything else you want to share? </label>
            <input type="text" name="MMERGE4" class="text" id="mce-MMERGE4" value="">
        </div>

        <div class="mc-field-group input-group">
            <strong>What are you interested in? (check all that apply) </strong>
            <ul>
            <li><input type="checkbox" name="group[1][1]" id="mce-group[1]-1-0" value=""><label for="mce-group[1]-1-0">Experimenter</label></li>
            <li><input type="checkbox" name="group[1][2]" id="mce-group[1]-1-1" value=""><label for="mce-group[1]-1-1">Hank Node</label></li>
            <li><input type="checkbox" name="group[1][4]" id="mce-group[1]-1-2" value=""><label for="mce-group[1]-1-2">Facility Partner</label></li>
            <li><input type="checkbox" name="group[1][8]" id="mce-group[1]-1-3" value=""><label for="mce-group[1]-1-3">Regional Provider</label></li>
            <li><input type="checkbox" name="group[1][16]" id="mce-group[1]-1-4" value=""><label for="mce-group[1]-1-4">Other</label></li>
            </ul>
            <span id="mce-group[1]-HELPERTEXT" class="helper_text">FYI: Deploying a Hank node brings FABRIC to your site</span>
        </div>

        <div id="mce-responses" class="clear">
            <div class="response" id="mce-error-response" style="display:none"></div>
            <div class="response" id="mce-success-response" style="display:none"></div>
        </div>

        <!-- Bot trap -->
        <div aria-hidden="true" style="position:absolute; left:-5000px;">
            <input type="text" name="b_473f2c587d0f8de123a54df78_622423558b" tabindex="-1" value="">
        </div>

        <div class="clear">
            <input type="submit" name="subscribe" id="mc-embedded-subscribe" class="button" value="Subscribe">
        </div>
        </div>
    </form>
    </div>
    `;

  return (
    <div
      // Optional container width; remove if you want it full width
      style={{ maxWidth: 600 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MailchimpForm;
