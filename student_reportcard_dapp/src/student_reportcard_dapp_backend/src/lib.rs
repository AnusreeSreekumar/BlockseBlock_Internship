use ic_cdk::{update};
use std::cell::RefCell;
use std::collections::HashMap;
use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct Student {
    pub name: String,
    pub total_marks: u32,
    pub num_subjects: u32,
}

thread_local! {
    static STUDENTS: RefCell<HashMap<String, Student>> = RefCell::new(HashMap::new());
}

#[ic_cdk::update]
pub fn add_student(name: String, total_marks: u32, num_subjects: u32) {
    let student = Student {
        name: name.clone(),
        total_marks,
        num_subjects,
    };

    STUDENTS.with(|students| {
        students.borrow_mut().insert(name, student);
    });
}

#[ic_cdk::query]
pub fn get_student(name: String) -> Option<Student> {
    STUDENTS.with(|students| {
        students.borrow().get(&name).cloned()
    })
}

#[ic_cdk::update]
pub fn delete_student(name: String) {
    STUDENTS.with(|students| {
        students.borrow_mut().remove(&name);
    });
}

#[ic_cdk::update]
pub fn update_student(name: String, total_marks: u32, num_subjects: u32) -> bool {
    STUDENTS.with(|students| {
        let mut map = students.borrow_mut();
        if let Some(student) = map.get_mut(&name) {
            student.total_marks = total_marks;
            student.num_subjects = num_subjects;
            true
        } else {
            false
        }
    })
}

#[ic_cdk::query]
pub fn calculate_average(name: String) -> Option<f32> {
    STUDENTS.with(|students| {
        students.borrow().get(&name).map(|s| {
            if s.num_subjects > 0 {
                s.total_marks as f32 / s.num_subjects as f32
            } else {
                0.0
            }
        })
    })
}

#[ic_cdk::query]
pub fn assign_grade(name: String) -> Option<String> {
    calculate_average(name.clone()).map(|avg| {
        if avg >= 90.0 {
            "A".to_string()
        } else if avg >= 75.0 {
            "B".to_string()
        } else if avg >= 60.0 {
            "C".to_string()
        } else {
            "D".to_string()
        }
    })
}

#[ic_cdk::query]
pub fn list_all_students() -> Vec<Student> {
    STUDENTS.with(|students| {
        students.borrow().values().cloned().collect()
    })
}

#[cfg(target_arch = "wasm32")]
#[ic_cdk::init]
fn init() {}

#[cfg(target_arch = "wasm32")]
use ic_cdk::export_candid;

#[cfg(target_arch = "wasm32")]
export_candid!();
