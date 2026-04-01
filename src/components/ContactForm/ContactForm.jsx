import React, { useState } from "react";
import "./ContactForm.css";
import { siteConfig } from "../../data";

const ContactForm = () => {
  const { form } = siteConfig.contact;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const rawBody = await response.text();
      let result = {};

      if (rawBody) {
        try {
          result = JSON.parse(rawBody);
        } catch {
          result = {};
        }
      }

      if (!response.ok) {
        throw new Error(result.error || `Request failed with status ${response.status}.`);
      }

      setSubmitMessage("Thanks! Your message has been sent.");
      setFormData({
        name: "",
        email: "",
        message: "",
        company: "",
      });
    } catch (error) {
      setIsError(true);
      setSubmitMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form">
      <div className="contact-form-row">
        <div className="contact-form-row-copy-item">
          <p className="primary sm">{form.eyebrow}</p>
        </div>
        <div className="contact-form-row-copy-item">
          <p className="primary sm">{form.scene}</p>
        </div>
        <div className="contact-form-row-copy-item">
          <p className="primary sm">{form.copyright}</p>
        </div>
      </div>

      <div className="contact-form-row">
        <div className="contact-form-col">
          <div className="contact-form-header">
            <h3>{form.title}</h3>

            <p>
              {form.description}
            </p>
          </div>

          <div className="contact-form-availability">
            <p className="primary sm">{form.availability[0]}</p>
            <p className="primary sm">{form.availability[1]}</p>
          </div>
        </div>

        <div className="contact-form-col">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              style={{ display: "none" }}
            />

            <div className="form-item">
              <input
                type="text"
                name="name"
                placeholder={form.placeholders.name}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-item">
              <input
                type="email"
                name="email"
                placeholder={form.placeholders.email}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-item">
              <textarea
                name="message"
                rows={6}
                placeholder={form.placeholders.message}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-item">
              <button className="btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : form.submitLabel}
              </button>
            </div>

            {submitMessage ? (
              <p className="primary sm" style={{ color: isError ? "#cf2f2f" : "inherit" }}>
                {submitMessage}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
