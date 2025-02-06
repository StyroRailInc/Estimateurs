#!/bin/bash
HANDLERS=("login" "logout" "sign-up" "delete-submission" "get-submissions" "create-submission" "replace-submissions")
LAMBDAS=("login" "logout" "sign-up" "deleteBuildBlock" "getBuildblock" "saveBuildBlock" "updateBuildBlock")
AWS_REGION="us-east-2"

echo "Compiling TypeScript..."
rm -rf dist
npm run build

deploy_lambda() {
  HANDLER=$1
  LAMBDA=$2

  echo "Deploying $HANDLER function to $LAMBDA..."

  ZIP_FILE="${HANDLER}.zip"
  rm -rf "$ZIP_FILE"

  cd dist
  zip -r "../$ZIP_FILE" handlers/$HANDLER.mjs utils middlewares managers
  cd ..
  zip -r "$ZIP_FILE" node_modules package-lock.json package.json

  echo "Updating AWS Lambda function: $LAMBDA"
  aws lambda update-function-code --function-name "$LAMBDA" --zip-file "fileb://$ZIP_FILE" --region "$AWS_REGION"

  rm -rf "$ZIP_FILE"
}

for i in "${!HANDLERS[@]}"; do
  deploy_lambda "${HANDLERS[$i]}" "${LAMBDAS[$i]}" &
done

wait  

rm -rf dist

echo "Build & Deployment Done"
