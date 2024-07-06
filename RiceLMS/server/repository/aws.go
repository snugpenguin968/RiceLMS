package repository

import (
	"context"
	"fmt"
	"log"
	"server/constants"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func InitializeDynamoDB() *dynamodb.Client {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("us-east-1"))
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	svc := dynamodb.NewFromConfig(cfg)
	return svc
}

func CreateTable(svc *dynamodb.Client) {
	// Define the table input
	tableInput := &dynamodb.CreateTableInput{
		TableName: aws.String("MachineStates"),
		KeySchema: []types.KeySchemaElement{
			{
				AttributeName: aws.String("machineId"),
				KeyType:       types.KeyTypeHash, // Partition key
			},
			{
				AttributeName: aws.String("startTime"),
				KeyType:       types.KeyTypeRange, // Sort key
			},
		},
		AttributeDefinitions: []types.AttributeDefinition{
			{
				AttributeName: aws.String("machineId"),
				AttributeType: types.ScalarAttributeTypeS,
			},
			{
				AttributeName: aws.String("startTime"),
				AttributeType: types.ScalarAttributeTypeS,
			},
		},
		ProvisionedThroughput: &types.ProvisionedThroughput{
			ReadCapacityUnits:  aws.Int64(5),
			WriteCapacityUnits: aws.Int64(5),
		},
	}

	// Create the table
	_, err := svc.CreateTable(context.TODO(), tableInput)
	if err != nil {
		log.Fatalf("failed to create table, %v", err)
	}

	log.Println("Successfully created table 'Machines'")
}

func AddMachineData(svc *dynamodb.Client, machineId, userId, startTime, endTime string) {
	_, err := svc.PutItem(context.TODO(), &dynamodb.PutItemInput{
		TableName: aws.String("MachineStates"),
		Item: map[string]types.AttributeValue{
			"machineId": &types.AttributeValueMemberS{Value: machineId},
			"userID":    &types.AttributeValueMemberS{Value: userId},
			"startTime": &types.AttributeValueMemberS{Value: startTime},
			"endTime":   &types.AttributeValueMemberS{Value: endTime},
		},
	})

	if err != nil {
		log.Fatalf("failed to put item, %v", err)
	}

	log.Println("Successfully added item to table 'Machines'")
}

func GetAllMachines(svc *dynamodb.Client) (*[]constants.Machine, error) {
	input := &dynamodb.ScanInput{
		TableName: aws.String("MachineStates"),
	}

	result, err := svc.Scan(context.TODO(), input)
	if err != nil {
		return nil, fmt.Errorf("failed to scan table: %w", err)
	}

	machines := []constants.Machine{}

	for _, item := range result.Items {
		machine := constants.Machine{}

		if val, ok := item["machineId"].(*types.AttributeValueMemberS); ok {
			machine.MachineID = val.Value
		}
		if val, ok := item["userID"].(*types.AttributeValueMemberS); ok {
			machine.UserID = val.Value
		}
		if val, ok := item["startTime"].(*types.AttributeValueMemberS); ok {
			startTime, err := time.Parse(time.RFC3339, val.Value)
			if err != nil {
				log.Printf("failed to parse startTime: %v", err)
				continue
			}
			machine.StartTime = startTime
		}
		if val, ok := item["endTime"].(*types.AttributeValueMemberS); ok {
			endTime, err := time.Parse(time.RFC3339, val.Value)
			if err != nil {
				log.Printf("failed to parse endTime: %v", err)
				continue
			}
			machine.EndTime = endTime
		}

		machines = append(machines, machine)
	}

	return &machines, nil
}

func DeleteMachine(svc *dynamodb.Client, machineId string, startTime string) error {
	input := &dynamodb.DeleteItemInput{
		TableName: aws.String("MachineStates"),
		Key: map[string]types.AttributeValue{
			"machineId": &types.AttributeValueMemberS{Value: machineId},
			"startTime": &types.AttributeValueMemberS{Value: startTime},
		},
	}

	_, err := svc.DeleteItem(context.TODO(), input)
	if err != nil {
		log.Printf("Failed to delete item: %v", err)
		return err
	}

	log.Printf("Successfully deleted machine %s with start time %s", machineId, startTime)
	return nil
}

func ListAllItems(svc *dynamodb.Client, tableName string) ([]map[string]types.AttributeValue, error) {
	var items []map[string]types.AttributeValue
	input := &dynamodb.ScanInput{
		TableName: aws.String(tableName),
	}

	result, err := svc.Scan(context.TODO(), input)
	if err != nil {
		return nil, err
	}

	items = append(items, result.Items...)
	fmt.Println(items)
	return items, nil
}

func DeleteAllItems(svc *dynamodb.Client, tableName string) error {
	items, err := ListAllItems(svc, tableName)
	if err != nil {
		return err
	}

	for _, item := range items {
		machineId := item["machineId"].(*types.AttributeValueMemberS).Value
		startTime := item["startTime"].(*types.AttributeValueMemberS).Value

		input := &dynamodb.DeleteItemInput{
			TableName: aws.String(tableName),
			Key: map[string]types.AttributeValue{
				"machineId": &types.AttributeValueMemberS{Value: machineId},
				"startTime": &types.AttributeValueMemberS{Value: startTime},
			},
		}

		_, err := svc.DeleteItem(context.TODO(), input)
		if err != nil {
			log.Printf("Failed to delete item with machineId: %s, startTime: %s, error: %v", machineId, startTime, err)
			return err
		}

		log.Printf("Successfully deleted item with machineId: %s, startTime: %s", machineId, startTime)
	}

	return nil
}

func StartDynamoDB() {
	svc := InitializeDynamoDB()
	CreateTable(svc)
}
