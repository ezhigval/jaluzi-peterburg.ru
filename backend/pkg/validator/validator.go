package validator

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

var validate *validator.Validate

func init() {
	validate = validator.New()

	// Регистрируем кастомную валидацию UUID
	validate.RegisterValidation("uuid", validateUUID)
}

func validateUUID(fl validator.FieldLevel) bool {
	value := fl.Field().String()
	if value == "" {
		return true // пустое значение обрабатывается отдельно через required
	}
	_, err := uuid.Parse(value)
	return err == nil
}

// ValidateStruct валидирует структуру и возвращает список ошибок
func ValidateStruct(s interface{}) []string {
	var errors []string

	if err := validate.Struct(s); err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			errors = append(errors, formatError(err))
		}
	}

	return errors
}

func formatError(err validator.FieldError) string {
	field := err.Field()
	tag := err.Tag()
	param := err.Param()

	switch tag {
	case "required":
		return fmt.Sprintf("field '%s' is required", strings.ToLower(field))
	case "email":
		return fmt.Sprintf("field '%s' must be a valid email", strings.ToLower(field))
	case "min":
		return fmt.Sprintf("field '%s' must be at least %s characters", strings.ToLower(field), param)
	case "max":
		return fmt.Sprintf("field '%s' must be at most %s characters", strings.ToLower(field), param)
	case "url":
		return fmt.Sprintf("field '%s' must be a valid URL", strings.ToLower(field))
	case "oneof":
		return fmt.Sprintf("field '%s' must be one of: %s", strings.ToLower(field), param)
	default:
		return fmt.Sprintf("field '%s' failed validation: %s", strings.ToLower(field), tag)
	}
}
