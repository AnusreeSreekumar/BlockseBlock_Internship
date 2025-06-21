Commands to deploy contract:

1) dfx start --clean --background
2) dfx deploy
3) if any changes done in the cargo.toml then run --> cargo update

To test the Rust fns from backend:
1) Add: dfx canister call student_reportcard_dapp_backend add_student '( "Alice", 450: nat32, 5: nat32 )'
2) Fetch: dfx canister call student_reportcard_dapp_backend get_student '("Alice")'
3) Update: dfx canister call student_reportcard_dapp_backend update_student '( "Alice", 480: nat32, 6: nat32 )'
4) Delete: dfx canister call student_reportcard_dapp_backend delete_student '("Alice")'
5) Average: dfx canister call student_reportcard_dapp_backend calculate_average '("Alice")'
6) Grade: dfx canister call student_reportcard_dapp_backend assign_grade '("Alice")'
7) Student List: dfx canister call student_reportcard_dapp_backend list_all_students

