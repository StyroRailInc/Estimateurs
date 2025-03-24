#!/bin/bash
HANDLERS=("login" "logout" "sign-up" "delete-submission" "get-submissions" "create-submission" "replace-submissions" "generate-pdf" "contact-us")
LAMBDAS=("login" "logout" "sign-up" "deleteBuildBlock" "getBuildblock" "saveBuildBlock" "updateBuildBlock" "generate-build-block-pdf" "contact-us")
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
  zip -r "../$ZIP_FILE" handlers/$HANDLER.mjs utils middlewares managers constants assets/*
  cd ..
  zip -r "$ZIP_FILE" node_modules package-lock.json package.json

  echo "Updating AWS Lambda function: $LAMBDA"
  aws lambda update-function-code --function-name "$LAMBDA" --zip-file "fileb://$ZIP_FILE" --region "$AWS_REGION"

  rm -rf "$ZIP_FILE"
}

if [ "$#" -gt 0 ]; then
  for name in "$@"; do
    for i in "${!HANDLERS[@]}"; do
      if [ "${HANDLERS[$i]}" == "$name" ]; then
        deploy_lambda "${HANDLERS[$i]}" "${LAMBDAS[$i]}"
      fi
    done
  done
else
  for i in "${!HANDLERS[@]}"; do
    deploy_lambda "${HANDLERS[$i]}" "${LAMBDAS[$i]}" &
  done
  wait
fi

rm -rf dist
echo "Build & Deployment Done"