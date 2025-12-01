import React from 'react';

export default function MailchimpForm({ openInNewTab = false }) {
  return (
    <div id="mc_embed_signup" style={{ maxWidth: 800 }}>
      <form
        action="https://renci.us22.list-manage.com/subscribe/post?u=473f2c587d0f8de123a54df78&amp;id=622423558b&amp;f_id=00efc2e1f0"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        className="validate"
        target={openInNewTab ? "_blank" : undefined}
        noValidate
      >
        <div id="mc_embed_signup_scroll">
          <div className="indicates-required">
            <span className="asterisk">*</span> indicates required
          </div>

          <div className="mc-field-group">
            <label htmlFor="mce-EMAIL">
              Email Address <span className="asterisk">*</span>
            </label>
            <input
              type="email"
              name="EMAIL"
              className="required email"
              id="mce-EMAIL"
              required
              defaultValue=""
            />
          </div>

          <div className="mc-field-group">
            <label htmlFor="mce-FNAME">First Name </label>
            <input type="text" name="FNAME" className="text" id="mce-FNAME" defaultValue="" />
          </div>

          <div className="mc-field-group">
            <label htmlFor="mce-LNAME">Last Name </label>
            <input type="text" name="LNAME" className="text" id="mce-LNAME" defaultValue="" />
          </div>

          <div className="mc-field-group">
            <label htmlFor="mce-MMERGE5">Organization/ Institution </label>
            <input type="text" name="MMERGE5" className="text" id="mce-MMERGE5" defaultValue="" />
          </div>

          <div className="mc-field-group">
            <label htmlFor="mce-MMERGE8">Industry </label>
            <input type="text" name="MMERGE8" className="text" id="mce-MMERGE8" defaultValue="" />
          </div>

          <div className="mc-field-group">
            <label htmlFor="mce-MMERGE4">Anything else you want to share? </label>
            <input type="text" name="MMERGE4" className="text" id="mce-MMERGE4" defaultValue="" />
          </div>

          <div className="mc-field-group input-group">
            <strong>What are you interested in? (check all that apply) </strong>
            <ul>
              <li>
                <input type="checkbox" name="group[1][1]" id="mce-group[1]-1-0" value="" />
                <label htmlFor="mce-group[1]-1-0">Experimenter</label>
              </li>
              <li>
                <input type="checkbox" name="group[1][2]" id="mce-group[1]-1-1" value="" />
                <label htmlFor="mce-group[1]-1-1">Hank Node</label>
              </li>
              <li>
                <input type="checkbox" name="group[1][4]" id="mce-group[1]-1-2" value="" />
                <label htmlFor="mce-group[1]-1-2">Facility Partner</label>
              </li>
              <li>
                <input type="checkbox" name="group[1][8]" id="mce-group[1]-1-3" value="" />
                <label htmlFor="mce-group[1]-1-3">Regional Provider</label>
              </li>
              <li>
                <input type="checkbox" name="group[1][16]" id="mce-group[1]-1-4" value="" />
                <label htmlFor="mce-group[1]-1-4">Other</label>
              </li>
            </ul>
            <span id="mce-group[1]-HELPERTEXT" className="helper_text">
              FYI: Deploying a Hank node brings FABRIC to your site.
            </span>
          </div>
          <div hidden>
            <input type="hidden" name="tags" value="358" />
          </div>

          <div id="mce-responses" className="clear">
            <div className="response" id="mce-error-response" style={{ display: 'none' }} />
            <div className="response" id="mce-success-response" style={{ display: 'none' }} />
          </div>
          <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
            <input
              type="text"
              name="b_473f2c587d0f8de123a54df78_622423558b"
              tabIndex={-1}
              defaultValue=""
            />
          </div>

          <div className="clear">
            <input type="submit" name="subscribe" id="mc-embedded-subscribe" className="button" value="Subscribe" />
          </div>
        </div>
      </form>
    </div>
  );
}
