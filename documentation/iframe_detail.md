# 🌐 Embed the Plan Viewer in Your Website

Easily display a Webuddhist plan directly on your site using an `<iframe>`. Below are clear, customizable examples and explanations.

---

## ✨ Quick Start: Example iframe

```html
<iframe
  src="https://plan.webuddhist.com/b42c9270-8bc9-4a98-b375-924a948ab18e?date=2026-05-10&source=itcc.com"
  width="100%"
  height="700"
  style="border:1px solid #eee; border-radius:12px;"
  allow="web-share; clipboard-write"
></iframe>
```

---

## 🔧 Customizing Your Embed

| Parameter      | Description                                                                                           | Example Value                |
| -------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------- |
| **plan ID**    | Replace `b42c9270-8bc9-4a98-b375-924a948ab18e` with your actual plan's ID.                            | `123e4567-e89b-12d3-a456-426614174000` |
| **source**     | Set to the domain or identifier of your website.                                                      | `yourdomain.com`             |
| **date**       | (optional) ISO format: `YYYY-MM-DD` to preselect a date.                                              | `2026-05-10`                 |
| **width**/**height** | Control the iframe size to fit your layout. Use `%`, `px`, or fixed numbers.                   | `width="800"` `height="600"` |
| **allow**      | Always include:<br/>`allow="web-share; clipboard-write"`<br/>for sharing and clipboard support.      |                              |

---

## 🎯 Full Example (for your site):

```html
<iframe
  src="https://plan.webuddhist.com/REPLACE_PLAN_ID?source=yourdomain.com"
  width="800"
  height="600"
  style="border:1px solid #eee; border-radius:12px;"
  allow="web-share; clipboard-write"
></iframe>
```

> 💡 **Tip:**  
> Customize `width`, `height`, and even add CSS in the `style` attribute for a polished look.

---

## ⚠️ Important Notes

- **source parameter**  
  Always set the `source` query parameter to your root domain (e.g., `yourdomain.com`).

- **Content Security Policy**  
  Ensure your website's CSP allows embedding from:  
  `https://plan.webuddhist.com`

- **Responsive Sizing**  
  Use `width="100%"` for responsive layouts, or set fixed pixel values for precise widths.

- **Permissions**  
  Keep `allow="web-share; clipboard-write"` to enable in-app sharing and copy features.

---

Enjoy bringing seamless plan viewing to your users! 🚀