package notification

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type TelegramNotifier struct {
	botToken string
	chatID   string
	client   *http.Client
}

func NewTelegramNotifier(botToken, chatID string) *TelegramNotifier {
	return &TelegramNotifier{
		botToken: botToken,
		chatID:   chatID,
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

type TelegramMessage struct {
	ChatID string `json:"chat_id"`
	Text   string `json:"text"`
	ParseMode string `json:"parse_mode,omitempty"`
}

func (t *TelegramNotifier) SendMessage(text string) error {
	if t.botToken == "" || t.chatID == "" {
		return nil // Не настроено, пропускаем
	}

	message := TelegramMessage{
		ChatID:    t.chatID,
		Text:      text,
		ParseMode: "HTML",
	}

	jsonData, err := json.Marshal(message)
	if err != nil {
		return fmt.Errorf("failed to marshal message: %w", err)
	}

	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", t.botToken)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := t.client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("telegram API returned status %d", resp.StatusCode)
	}

	return nil
}

func FormatLeadMessage(name, phone, email, message, pageURL string) string {
	text := fmt.Sprintf("<b>Новая заявка</b>\n\n")
	text += fmt.Sprintf("<b>Имя:</b> %s\n", escapeHTML(name))
	text += fmt.Sprintf("<b>Телефон:</b> %s\n", escapeHTML(phone))

	if email != "" {
		text += fmt.Sprintf("<b>Email:</b> %s\n", escapeHTML(email))
	}

	if message != "" {
		text += fmt.Sprintf("<b>Сообщение:</b> %s\n", escapeHTML(message))
	}

	if pageURL != "" {
		text += fmt.Sprintf("<b>Страница:</b> %s\n", escapeHTML(pageURL))
	}

	text += fmt.Sprintf("\n<i>Дата:</i> %s", time.Now().Format("02.01.2006 15:04"))
	return text
}

