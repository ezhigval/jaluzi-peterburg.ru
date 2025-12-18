package notification

import (
	"fmt"
	"net/smtp"
	"strings"
	"time"
)

type EmailNotifier struct {
	host     string
	port     int
	user     string
	password string
	from     string
}

func NewEmailNotifier(host string, port int, user, password, from string) *EmailNotifier {
	return &EmailNotifier{
		host:     host,
		port:     port,
		user:     user,
		password: password,
		from:     from,
	}
}

func (e *EmailNotifier) SendEmail(to, subject, body string) error {
	if e.host == "" {
		return nil // Не настроено, пропускаем
	}

	addr := fmt.Sprintf("%s:%d", e.host, e.port)
	auth := smtp.PlainAuth("", e.user, e.password, e.host)

	message := buildEmailMessage(e.from, to, subject, body)

	return smtp.SendMail(addr, auth, e.from, []string{to}, []byte(message))
}

func buildEmailMessage(from, to, subject, body string) string {
	headers := make([]string, 0)
	headers = append(headers, fmt.Sprintf("From: %s", from))
	headers = append(headers, fmt.Sprintf("To: %s", to))
	headers = append(headers, fmt.Sprintf("Subject: %s", subject))
	headers = append(headers, "MIME-Version: 1.0")
	headers = append(headers, "Content-Type: text/html; charset=UTF-8")
	headers = append(headers, "")

	return strings.Join(headers, "\r\n") + "\r\n" + body
}

func FormatLeadEmailHTML(name, phone, email, message, pageURL string) string {
	html := `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background-color: #2563eb; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
		.content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
		.field { margin-bottom: 15px; }
		.field-label { font-weight: bold; color: #1f2937; }
		.field-value { color: #4b5563; margin-top: 5px; }
		.footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>Новая заявка</h1>
		</div>
		<div class="content">
			<div class="field">
				<div class="field-label">Имя:</div>
				<div class="field-value">` + escapeHTML(name) + `</div>
			</div>
			<div class="field">
				<div class="field-label">Телефон:</div>
				<div class="field-value">` + escapeHTML(phone) + `</div>
			</div>`

	if email != "" {
		html += `
			<div class="field">
				<div class="field-label">Email:</div>
				<div class="field-value">` + escapeHTML(email) + `</div>
			</div>`
	}

	if message != "" {
		html += `
			<div class="field">
				<div class="field-label">Сообщение:</div>
				<div class="field-value">` + escapeHTML(message) + `</div>
			</div>`
	}

	if pageURL != "" {
		html += `
			<div class="field">
				<div class="field-label">Страница:</div>
				<div class="field-value"><a href="` + escapeHTML(pageURL) + `">` + escapeHTML(pageURL) + `</a></div>
			</div>`
	}

	html += `
		</div>
		<div class="footer">
			Дата: ` + time.Now().Format("02.01.2006 15:04") + `
		</div>
	</div>
</body>
</html>`

	return html
}

